## Inspect the JWT token

```
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "grant_type=authorization_code&code=3TS2M7WBe_HtJwHjrlIJsGK2S2NYwkieNDneiRRmCHa&redirect_uri=https%3A%2F%2Foidcdebugger.com%2Fdebug&client_id=ping&client_secret=abc" https://oidc-pilot-bzpbckavda-wn.a.run.app/token

```

```
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "grant_type=authorization_code&code=5hEFFmgrdQwqWvMnotKcJvOgqiNvx3Ebg6tfADmLeae&redirect_uri=https%3A%2F%2Foidcdebugger.com%2Fdebug&client_id=ping&client_secret=abc" http://localhost:3000/token

```
