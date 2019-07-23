const Express = require("express");

const Bottle = require("../bottle");
const { HttpUtils } = require("../utils");

const router = Express.Router();
const productManager = Bottle.ProductManager;

router.post("/", async (req, res) => {
  HttpUtils.sendResponse(res, await productManager.createProduct(req.body));
});

router.patch("/", async (req, res) => {
  HttpUtils.sendResponse(res, await productManager.patchProduct(req.body));
});

router.delete("/", async (req, res) => {
  HttpUtils.sendResponse(res, await productManager.deleteProduct(req.body));
});

module.exports = router;
