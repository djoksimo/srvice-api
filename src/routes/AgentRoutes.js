const Express = require("express");

const Bottle = require("../bottle");
const { HttpUtils } = require("../utils");

const router = Express.Router();
const agentManager = Bottle.AgentManager;

router.get("/:id", async (req, res) => {
  HttpUtils.sendResponse(res, await agentManager.getAgentById(req.params));
});

module.exports = router;
