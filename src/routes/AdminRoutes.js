const Express = require("express");

const { HttpUtils } = require("../utils");
const { cradle: categoryManager } = require("../container");

const router = Express.Router();
const ADMIN_PASSWORD = "iakd8k98qogbb8eku1nwzmxdhyhyogxbpn22rub473499rkbpu0hvux4ne6ifjxqqxgvabsxukf0f88904lqxtlf9";

router.use((req, res, next) => {
  const { headers } = req;
  if (!headers.authorization || headers.authorization !== ADMIN_PASSWORD) {
    return res.sendStatus(403);
  }
  next();
});

router.post("/category", async (req, res) => {
  HttpUtils.sendResponse(res, await categoryManager.createCategory(req.body));
});

router.get("/category", async (req, res) => {
  HttpUtils.sendResponse(res, await categoryManager.getAllCategories());
});

router.delete("/category", async (req, res) => {
  HttpUtils.sendResponse(res, await categoryManager.deleteCategory(req.body));
});

router.patch("/category", async (req, res) => {
  HttpUtils.sendResponse(res, await categoryManager.patchCategory(req.body));
});

module.exports = router;
