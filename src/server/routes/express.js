/* eslint-disable no-console, camelcase, no-unused-vars */
import { strict as assert } from 'node:assert';
import * as querystring from 'node:querystring';
import { inspect } from 'node:util';
import { SessionNotFound } from '../../lib/helpers/errors.js';

import isEmpty from 'lodash/isEmpty.js';
import { urlencoded } from 'express'; // eslint-disable-line import/no-unresolved

import Account from '../support/account.js';
import { initSession } from '../incode/init.js';
import { clientTenant } from '../incode/client.js';
import { getScores } from '../incode/api/get-scores.js';
import { getOcr } from '../incode/api/get-ocr.js';
import { extraProcessing } from '../incode/helpers/extra-processing.js';

const body = urlencoded({ extended: false });

const keys = new Set();
const debug = (obj) => querystring.stringify(Object.entries(obj).reduce((acc, [key, value]) => {
  keys.add(key);
  if (isEmpty(value)) return acc;
  acc[key] = inspect(value, { depth: null });
  return acc;
}, {}), '<br/>', ': ', {
  encodeURIComponent(value) { return keys.has(value) ? `<strong>${value}</strong>` : value; },
});

export default (app, provider) => {

  // app.use((req, res, next) => {
  //   const orig = res.render;
  //   // you'll probably want to use a full blown render engine capable of layouts
  //   res.render = (view, locals) => {
  //     app.render(view, locals, (err, html) => {
  //       if (err) throw err;
  //       orig.call(res, '_layout', {
  //         ...locals,
  //         body: html,
  //       });
  //     });
  //   };
  //   next();
  // });

  app.use((req, res, next) => {
    const orig = res.render;
    res.render = (view, locals) => {
      app.render(view, locals, (err, html) => {
        if (view !== 'login') {
          if (err) throw err;
          orig.call(res, '_layout', {
            ...locals,
            body: html,
          });

        } else {
          orig.call(res, view, {
            ...locals
          });
        }

      });
    };
    next();
  });

  function setNoCache(req, res, next) {
    res.set('cache-control', 'no-store');
    next();
  }

  app.get('/interaction/:uid', setNoCache, async (req, res, next) => {
    try {
      const {
        uid, prompt, params, session,
      } = await provider.interactionDetails(req, res);

      const client = await provider.Client.find(params.client_id);
      const frontendHostname = process.env.FRONTEND_HOSTNAME;
      const incode = await initSession(clientTenant, 'init', uid);
      const interviewId = incode.auth.interviewId;
      const apiUrl = clientTenant.API_URL;

      //const interview = JSON.stringify(incode);
      const interview = JSON.stringify({
        key: incode.auth.token,
        id: incode.auth.interviewId,
        uid: uid,
        apiUrl: clientTenant.API_URL
      });



      switch (prompt.name) {
        case 'login': {
          return res.render('login', {
            client,
            frontendHostname,
            uid,
            interview,
            interviewId,
            apiUrl,
            details: prompt.details,
            params,
            title: 'Sign-in',
            session: session ? debug(session) : undefined,
            dbg: {
              params: debug(params),
              prompt: debug(prompt),
            },
          });
        }
        case 'consent': {
          return res.render('interaction', {
            client,
            uid,
            details: prompt.details,
            params,
            title: 'Authorize',
            session: session ? debug(session) : undefined,
            dbg: {
              params: debug(params),
              prompt: debug(prompt),
            },
          });
        }
        default:
          return undefined;
      }
    } catch (err) {
      return next(err);
    }
  });

  app.post('/interaction/:uid/login', setNoCache, body, async (req, res, next) => {
    try {
      
      const interview = JSON.parse(req.body.interview);

      // Process interview and do digital verification 
      if (interview && interview.id === req.body.interviewId && interview.uid) {

        const incode = await initSession(clientTenant, 'login', interview.uid, req.body.interviewId);
        
        const scores = await getScores(clientTenant, interview.id, incode.header);
        const ocr = await getOcr(clientTenant, interview.id, incode.header);
        
        const combined = {...scores.data, ...ocr.data};
        
        const data = {
          success: scores && ocr ? true : false,
          interviewId: req.body.interviewId,
          id: req.body.interviewId,
          ...combined
        }

        const account = await Account.findByLogin(req.body.interviewId, data);

        const { grantId, params, prompt: { name } } = await provider.interactionDetails(req, res);

        assert.equal(name, 'login');

        let grant;
        if (grantId) {
          grant = await provider.Grant.find(grantId);
        } else {
          grant = new provider.Grant({ accountId: account.accountId, clientId: params.client_id });
          if (params?.scope) {
            grant.addOIDCScope(params?.scope);
          }
        }

        const result = {
          consent: {
            grantId: await grant.save()
          },
          login: {
            accountId: account.accountId,
          },
        };

        //Gets images and deletes the identity verification session from Incode's platform 
        const finish = extraProcessing(clientTenant, interview.id, incode.header);

        await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
        
      }



    } catch (err) {
      next(err);
    }
  });

  app.post('/interaction/:uid/confirm', setNoCache, body, async (req, res, next) => {
    try {
      const interactionDetails = await provider.interactionDetails(req, res);
      const { prompt: { name, details }, params, session: { accountId } } = interactionDetails;
      assert.equal(name, 'consent');

      let { grantId } = interactionDetails;
      let grant;

      if (grantId) {
        // we'll be modifying existing grant in existing session
        grant = await provider.Grant.find(grantId);
      } else {
        // we're establishing a new grant
        grant = new provider.Grant({
          accountId,
          clientId: params.client_id,
        });
      }

      if (details.missingOIDCScope) {
        grant.addOIDCScope(details.missingOIDCScope.join(' '));
      }
      if (details.missingOIDCClaims) {
        grant.addOIDCClaims(details.missingOIDCClaims);
      }
      if (details.missingResourceScopes) {
        for (const [indicator, scopes] of Object.entries(details.missingResourceScopes)) {
          grant.addResourceScope(indicator, scopes.join(' '));
        }
      }

      grantId = await grant.save();

      const consent = {};
      if (!interactionDetails.grantId) {
        // we don't have to pass grantId to consent, we're just modifying existing one
        consent.grantId = grantId;
      }

      const result = { consent };
      await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: true });
    } catch (err) {
      next(err);
    }
  });

  app.get('/interaction/:uid/abort', setNoCache, async (req, res, next) => {
    try {
      const result = {
        error: 'access_denied',
        error_description: 'End-User aborted interaction',
      };
      await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
    } catch (err) {
      next(err);
    }
  });

  app.use((err, req, res, next) => {
    if (err instanceof SessionNotFound) {
      // handle interaction expired / session not found error
    }
    next(err);
  });
};
