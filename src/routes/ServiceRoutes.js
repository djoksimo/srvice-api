const Express = require("express");

const { HttpUtils } = require("../utils");
const bottle = require("../bottle");

const router = Express.Router();
const serviceManager = bottle.ServiceManager;
const authenticationManager = bottle.AuthenticationManager;

const isAuthenticated = (req, res, callback) => {
  const authHeaders = HttpUtils.parseAuthHeaders(req);
  authenticationManager
    .authenticateIdEmailToken(authHeaders)
    .then(async () => {
      callback();
    })
    .catch(() => res.status(403).json({}));
};

router.post("/", (req, res) =>
  isAuthenticated(req, res, async () => {
    HttpUtils.sendResponse(res, await serviceManager.createService(req.body));
  }),
);

router.get("/nearby", async (req, res) => {
  HttpUtils.sendResponse(res, await serviceManager.getNearbyServicesByCategoryId(req.query));
});

router.get("/:id", async (req, res) => {
  HttpUtils.sendResponse(res, await serviceManager.getServiceById(req.params));
});

router.patch("/", (req, res) =>
  isAuthenticated(req, res, async () => {
    const authHeaders = HttpUtils.parseAuthHeaders(req);
    HttpUtils.sendResponse(res, await serviceManager.patchService(req.body, authHeaders));
  }),
);

router.delete("/:id", (req, res) =>
  isAuthenticated(req, res, async () => {
    const authHeaders = HttpUtils.parseAuthHeaders(req);
    HttpUtils.sendResponse(res, await serviceManager.deleteService(req.params.id, authHeaders));
  }),
);

module.exports = router;
