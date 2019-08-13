const Express = require("express");

const { HttpUtils } = require("../utils");
const bottle = require("../bottle");

const router = Express.Router();
const serviceManager = bottle.ServiceManager;
const authenticationManager = bottle.AuthenticationManager;

router.post("/", async (req, res) => {
  authenticationManager.authenticateIdEmailToken(HttpUtils.parseAuthHeaders(req)).then(async () => {
    HttpUtils.sendResponse(res, await serviceManager.createService(req.body));
  }).catch(() => res.status(403).json({}));  
});

router.get("/nearby", async (req, res) => {
  HttpUtils.sendResponse(res, await serviceManager.getNearbyServicesByCategoryId(req.query));
});

router.get("/:id", async (req, res) => {
  HttpUtils.sendResponse(res, await serviceManager.getServiceById(req.params));
});

router.patch("/", async (req, res) => {
  authenticationManager.authenticateIdEmailToken(HttpUtils.parseAuthHeaders(req)).then(async () => {
    HttpUtils.sendResponse(res, await serviceManager.patchService(req.body, HttpUtils.parseAuthHeaders(req)));
  }).catch(() => res.status(403).json({}));  
});

router.delete("/:id", async (req, res) => {
  authenticationManager.authenticateIdEmailToken(HttpUtils.parseAuthHeaders(req)).then(async () => {
    HttpUtils.sendResponse(res, await serviceManager.deleteService(req.params.id, HttpUtils.parseAuthHeaders(req)));
  }).catch(() => res.status(403).json({}));  
});

module.exports = router;
