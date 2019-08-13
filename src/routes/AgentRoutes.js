const Express = require("express");

const Bottle = require("../bottle");
const { HttpUtils } = require("../utils");

const router = Express.Router();
const agentManager = Bottle.AgentManager;
const authenticationManager = Bottle.AuthenticationManager;

router.get("/:id", async (req, res) => {
  HttpUtils.sendResponse(res, await agentManager.getAgentById(req.params));
});

router.patch("/", async (req, res) => {
  const authHeaders = HttpUtils.parseAuthHeaders(req);
  authenticationManager.authenticateIdEmailToken(authHeaders).then(async () => {
    if (authHeaders.agentId !== req.body._id) {
      throw new Error("Nice try ;)");
    }
    HttpUtils.sendResponse(res, await agentManager.patchAgent(req.body));
  }).catch(() => res.status(403).json({}));

});

module.exports = router;
