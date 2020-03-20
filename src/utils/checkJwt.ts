import jwt from "express-jwt";
import jwks from "jwks-rsa";

export const checkJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://dev-b63q048e.auth0.com/.well-known/jwks.json",
  }),
  audience: "https://api.srvice.ca/auth0",
  issuer: "https://dev-b63q048e.auth0.com/",
  algorithms: ["RS256"],
});
