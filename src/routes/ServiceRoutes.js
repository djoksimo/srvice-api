const Express = require("express");

const { HttpUtils } = require("../utils");
const bottle = require("../bottle");

const router = Express.Router();
const serviceManager = bottle.ServiceManager;

router.post("/", async (req, res) => {
  HttpUtils.sendResponse(res, await serviceManager.createService(req.body));
});

router.get("/nearby", async (req, res) => {
  HttpUtils.sendResponse(res, await serviceManager.getNearbyServicesByCategoryId(req.query));
});

router.get("/:id", async (req, res) => {
  HttpUtils.sendResponse(res, await serviceManager.getServiceById(req.params));
});

router.patch("/", async (req, res) => {
  HttpUtils.sendResponse(res, await serviceManager.patchService(req.body));
});

router.delete("/:id", async (req, res) => {
  HttpUtils.sendResponse(res, await serviceManager.deleteService(req.params));
});

module.exports = router;
