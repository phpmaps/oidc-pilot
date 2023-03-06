# Incode OIDC Verification Server

This project is an minimal OIDC server compatible with Ping technologies and cloud hosting platforms.

## Core features
Users will be asked to prove their identity when this server receives requests from an OIDC client app.
For the study, Incode has provided a custom "frontend" application that lives in a separate project. This application includes the physical identity proofing screens, which GSA can "plug-in" to this server.

This plug in pattern enables a separation of concerns during the study.

It will allow GSA to update the "look and feel" of the application without impacting the core OIDC framework.
Additionally, if there is an interest we can add and subtract Identity proofing modules during the study with things like Proof of Address, On-time-passcodes and e-Signature stuff for evaluation also without impacting the OIDC server. 

This would be in addition to the default Identity Proofing modules of:
* Liveness detection
* Face Recognition
* ID verification

When administering this server there are a couple of things to be aware of:

1. You must assign yourself your own OIDC Client ID, Secret and Redirect URL
2. You must specify an OIDC Issuer Hostname
3. You must specify your Incode API URL, API Client ID, Flow Id
4. You must have a Redis Server for managing application state in Cloud Foundry or other cloud platforms
5. You also must assign a Hostname for the frontend interaction screens

All of this can be done but updating environment variables. If there are questions, Incode is happy to help with any setup and integration support.

## Prerequisites

This project has a minimum requirement of node __v16.17.0__ (Gallium).

Commands for running the OIDC server locally

### Install required node packages

```
npm install
```

Run the project

```
npm run start
```

This server will open on:

* http://localhost:3000

The OIDC Metadata can be access from:

* http://localhost:3000/.well-known/openid-configuration

## System environment

Lastly, below are sample environmental variables to get you started. Please do change them :)

```
OIDC_ISSUER=http://localhost:3000
FRONTEND_HOSTNAME=http://localhost:3000

REDIS_HOST=3.239.44.132
REDIS_PORT=6379
REDIS_PASSWORD=abcd1234

API_URL=https://demo-api.incodesmile.com/0
API_KEY=8ea31b1619d4ec9a6905739f14a41866ea7f0d92
API_VERSION=1.0
CLIENT_ID=gsatss405
FLOW_ID=63ed16977ded9e42dfcb6f61

OIDC_CLIENT_ID=ping
OIDC_SECRET=abc
OIDC_REDIRECT_1=https://oidcdebugger.com/debug
OIDC_REDIRECT_2=https://auth.pingone.com/09862d22-4554-4677-abf7-72fea5ae1fa0/davinci/oauth2/callback
OIDC_REDIRECT_3=https://auth.pingone.com/e08ece74-1d3a-48ef-b796-d031b34597d3/davinci/oauth2/callback

```

Finally, as with OIDC technology client apps will recieve a JWT encoded id_token. This token will contain identity proofing results. See example below.

This is what a "PASS" looks like from Incode.

```

{
  "sub": "64066bd40089fa8a38421a18",
  "nonce": "5a87zy15uo8",
  "at_hash": "6IEMC906LE10d9JUeQgHVg",
  "data": {
    "success": true,
    "interviewId": "64066bd40089fa8a38421a18",
    "id": "64066bd40089fa8a38421a18",
    "screenIdLiveness_value": "OK",
    "screenIdLiveness_status": "OK",
    "barcode2DDetected_status": "OK",
    "barcodeContent_status": "OK",
    "documentNumberCrosscheck_status": "OK",
    "documentExpired_status": "OK",
    "faceRecognition_maskCheck": {
      "value": "0.0",
      "status": "OK"
    },
    "faceRecognition_lensesCheck": "OK",
    "faceRecognition_faceBrightness": "OK",
    "faceRecognition_overall_value": "80.4",
    "faceRecognition_overall_status": "OK",
    "livenessScore_value": "78.1",
    "livenessScore_status": "OK",
    "photoQuality_value": "883.2",
    "liveness_overall_value": "78.1",
    "liveness_overall_status": "OK",
    "overall_value": "86.2",
    "overall_status": "OK",
    "overall_reason": "This session passed because it passed all of Incode's tests: ID Verification, Face Recognition, Liveness Detection",
    "fullName": "DOUG CARROLL",
    "machineReadableFullName": "DOUGL CARROLL",
    "firstName": "DOUG",
    "middleName": "OWEN",
    "givenName": "DOUG BARRETT",
    "paternalLastName": "CARROLL",
    "address": "992 SAN JACINTO ST REDLANDS CA 923730000 USA",
    "documentNumber": "E3582769",
    "typeOfId": "DriversLicense",
    "gender": "M",
    "fullNameMrz": "DOUG CARROLL",
    "barcodeRawData": "@\n\u001e\rANSI 6360140436678DL00410287ZC03280024DLDAQE3666769\",
    "issuedAt": "1-4-2023",
    "expireAt": "4-21-2023",
    "birthDate": "4-21-1978"
  },
  "aud": "ping",
  "exp": 1678229000,
  "iat": 1678142600,
  "iss": "http://localhost:3000"
}


```