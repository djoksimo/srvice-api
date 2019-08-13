const Express = require("express");

const Bottle = require("../bottle");
const { HttpUtils } = require("../utils");

const router = Express.Router();
const requestManager = Bottle.RequestManager;
const authenticationManager = Bottle.AuthenticationManager;

const isAuthenticated = (req, res, callback) => {
  const authHeaders = HttpUtils.parseAuthHeaders(req);
  authenticationManager.authenticateIdEmailToken(authHeaders).then(async () => {
    callback();
  }).catch(() => res.status(403).json({}));
};

router.post("/", (req, res) => isAuthenticated(req, res, async () => {
  HttpUtils.sendResponse(res, await requestManager.createRequest(req.body));
}));

module.exports = router;
