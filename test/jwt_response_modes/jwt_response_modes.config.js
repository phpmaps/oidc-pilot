import merge from 'lodash/merge.js';

import getConfig from '../default.config.js';

const config = getConfig();

merge(config.features, {
  encryption: { enabled: true },
  webMessageResponseMode: { enabled: true },
  jwtResponseModes: { enabled: true },
});

export default {
  config,
  clients: [
    {
      client_id: 'client',
      grant_types: ['authorization_code', 'implicit'],
      response_types: ['code', 'id_token token', 'none'],
      redirect_uris: ['https://client.example.com'],
      token_endpoint_auth_method: 'none',
    },
    {
      client_id: 'client-encrypted',
      client_secret: 'secret',
      grant_types: ['authorization_code', 'implicit'],
      response_types: ['code', 'id_token token', 'none'],
      redirect_uris: ['https://client.example.com'],
      authorization_encrypted_response_alg: 'A128KW',
    },
    {
      client_id: 'client-expired',
      client_secret: 'secret',
      client_secret_expires_at: 1,
      grant_types: ['authorization_code', 'implicit'],
      response_types: ['code', 'id_token token', 'none'],
      redirect_uris: ['https://client.example.com'],
      authorization_signed_response_alg: 'HS256',
    },
  ],
};
