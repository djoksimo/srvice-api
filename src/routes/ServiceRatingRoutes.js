const Express = require("express");

const { HttpUtils } = require("../utils");
const bottle = require("../bottle");

const router = Express.Router();
const serviceRatingManager = bottle.ServiceRatingManager;
const authenticationManager = bottle.AuthenticationManager;

const isAuthenticated = (req, res, callback) => {
  const authHeaders = HttpUtils.parseAuthHeaders(req);
  authenticationManager.authenticateIdEmailToken(authHeaders).then(async () => {
    callback();
  }).catch(() => res.status(403).json({}));
};

router.post("/", (req, res) => isAuthenticated(req, res, async () => {
  HttpUtils.sendResponse(res, await serviceRatingManager.createServiceRating(req.body));
}));

router.patch("/", (req, res) => isAuthenticated(req, res, async () => {
  const authHeaders = HttpUtils.parseAuthHeaders(req);
  HttpUtils.sendResponse(res, await serviceRatingManager.patchServiceRating(req.body, authHeaders));
}));

module.exports = router;
