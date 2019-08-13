const Express = require("express");

const Bottle = require("../bottle");
const { HttpUtils } = require("../utils");

const router = Express.Router();
const requestManager = Bottle.RequestManager;
const authenticationManager = Bottle.AuthenticationManager;

router.post("/", async (req, res) => {
  authenticationManager.authenticateIdEmailToken(HttpUtils.parseAuthHeaders(req)).then(async () => {
    HttpUtils.sendResponse(res, await requestManager.createRequest(req.body));
  }).catch(() => res.status(403).json({}));
});

module.exports = router;
