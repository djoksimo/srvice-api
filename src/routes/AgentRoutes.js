const Express = require("express");

const Bottle = require("../bottle");
const { HttpUtils } = require("../utils");

const router = Express.Router();
const agentManager = Bottle.AgentManager;
const authenticationManager = Bottle.AuthenticationManager;

const isAuthenticated = (req, res, callback) => {
  const authHeaders = HttpUtils.parseAuthHeaders(req);
  authenticationManager.authenticateIdEmailToken(authHeaders).then(async () => {
    callback();
  }).catch(() => res.status(403).json({}));
};

router.get("/:id", async (req, res) => {
  HttpUtils.sendResponse(res, await agentManager.getAgentById(req.params));
});

router.patch("/", (req, res) => isAuthenticated(req, res, async () => {
  const authHeaders = HttpUtils.parseAuthHeaders(req);
  if (authHeaders.agentId !== req.body._id) {
    res.status(403).json({ error: "Nice try ;)" });
  }
  HttpUtils.sendResponse(res, await agentManager.patchAgent(req.body));
}));

module.exports = router;
