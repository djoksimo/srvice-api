const Express = require("express");

const { HttpUtils } = require("../utils");
const bottle = require("../bottle");

const router = Express.Router();
const serviceRatingManager = bottle.ServiceRatingManager;
const authenticationManager = bottle.AuthenticationManager;

router.post("/", async (req, res) => {
  authenticationManager.authenticateIdEmailToken(HttpUtils.parseAuthHeaders(req)).then(async () => {
    HttpUtils.sendResponse(res, await serviceRatingManager.createServiceRating(req.body));
  }).catch(() => res.status(403).json({}));
});

router.patch("/", async (req, res) => {
  const authHeaders = HttpUtils.parseAuthHeaders(req);
  authenticationManager.authenticateIdEmailToken(authHeaders).then(async () => {
    HttpUtils.sendResponse(res, await serviceRatingManager.patchServiceRating(req.body, authHeaders));
  }).catch(() => res.status(403).json({}));
});

module.exports = router;
