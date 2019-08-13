const Express = require("express");

const Bottle = require("../bottle");
const { HttpUtils } = require("../utils");

const router = Express.Router();
const productManager = Bottle.ProductManager;
const authenticationManager = Bottle.AuthenticationManager;

router.post("/", async (req, res) => {
  const authHeaders = HttpUtils.parseAuthHeaders(req);
  authenticationManager.authenticateIdEmailToken(authHeaders).then(async () => {
    HttpUtils.sendResponse(res, await productManager.createProduct(req.body, authHeaders));
  }).catch(() => res.status(403).json({}));
});

router.patch("/", async (req, res) => {
  const authHeaders = HttpUtils.parseAuthHeaders(req);
  authenticationManager.authenticateIdEmailToken(authHeaders).then(async () => {
    HttpUtils.sendResponse(res, await productManager.patchProduct(req.body, authHeaders));
  }).catch(() => res.status(403).json({}));
});

router.delete("/", async (req, res) => {
  const authHeaders = HttpUtils.parseAuthHeaders(req);
  authenticationManager.authenticateIdEmailToken(authHeaders).then(async () => {
    HttpUtils.sendResponse(res, await productManager.deleteProduct(req.body, authHeaders));
  }).catch(() => res.status(403).json({}));
});

module.exports = router;
