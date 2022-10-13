import jwt from "express-jwt";
import jwks from "jwks-rsa";

export const checkJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://<your-domain>.auth0.com/.well-known/jwks.json",
  }),
  audience: "<your-audience>",
  issuer: "https://<your-domain>.auth0.com/",
  algorithms: ["RS256"],
});
