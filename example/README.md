## Details

URL:  https://oidc-pilot-bzpbckavda-wn.a.run.app/.well-known/openid-configuration

```

{
	"authorization_endpoint": "http://oidc-pilot-bzpbckavda-wn.a.run.app/auth",
	"device_authorization_endpoint": "http://oidc-pilot-bzpbckavda-wn.a.run.app/device/auth",
	"claims_parameter_supported": false,
	"claims_supported": ["sub", "address", "email", "email_verified", "phone_number", "phone_number_verified", "birthdate", "family_name", "gender", "given_name", "locale", "middle_name", "name", "nickname", "picture", "preferred_username", "profile", "updated_at", "website", "zoneinfo", "sid", "auth_time", "iss"],
	"code_challenge_methods_supported": ["S256"],
	"end_session_endpoint": "http://oidc-pilot-bzpbckavda-wn.a.run.app/session/end",
	"grant_types_supported": ["implicit", "authorization_code", "refresh_token", "urn:ietf:params:oauth:grant-type:device_code"],
	"issuer": "https://oidc-pilot-bzpbckavda-wn.a.run.app",
	"jwks_uri": "http://oidc-pilot-bzpbckavda-wn.a.run.app/jwks",
	"authorization_response_iss_parameter_supported": true,
	"response_modes_supported": ["form_post", "fragment", "query"],
	"response_types_supported": ["code id_token", "code", "id_token", "none"],
	"scopes_supported": ["openid", "offline_access", "address", "email", "phone", "profile"],
	"subject_types_supported": ["public"],
	"token_endpoint_auth_methods_supported": ["client_secret_basic", "client_secret_jwt", "client_secret_post", "private_key_jwt", "none"],
	"token_endpoint_auth_signing_alg_values_supported": ["HS256", "RS256", "PS256", "ES256", "EdDSA"],
	"token_endpoint": "http://oidc-pilot-bzpbckavda-wn.a.run.app/token",
	"id_token_signing_alg_values_supported": ["PS256", "RS256", "ES256"],
	"pushed_authorization_request_endpoint": "http://oidc-pilot-bzpbckavda-wn.a.run.app/request",
	"request_parameter_supported": false,
	"request_uri_parameter_supported": false,
	"userinfo_endpoint": "http://oidc-pilot-bzpbckavda-wn.a.run.app/me",
	"revocation_endpoint": "http://oidc-pilot-bzpbckavda-wn.a.run.app/token/revocation",
	"claim_types_supported": ["normal"]
}

```