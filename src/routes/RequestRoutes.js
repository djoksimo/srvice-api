const Express = require("express");

const Bottle = require("../bottle");
const { HttpUtils } = require("../utils");

const router = Express.Router();
const requestManager = Bottle.RequestManager;

router.post("/", async (req, res) => {
  HttpUtils.sendResponse(res, await requestManager.createRequest(req.body));
});

module.exports = router;
