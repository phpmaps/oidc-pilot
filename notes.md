## Inspect the JWT token

```
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "grant_type=authorization_code&code=Vp4r_rXZ-MVK_veB92HAyZtmU9D-2Z4Wcgw9EXzDXT-&redirect_uri=https%3A%2F%2Foidcdebugger.com%2Fdebug&client_id=ping&client_secret=abc" https://oidc-pilot-bzpbckavda-wn.a.run.app/token

```

```
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "grant_type=authorization_code&code=_WcZhc9mgxbB2TN_C0TRF0bLcRLBzdZ5Zae11GAmwAd&redirect_uri=https%3A%2F%2Foidcdebugger.com%2Fdebug&client_id=ping&client_secret=abc" http://localhost:3000/token

```
