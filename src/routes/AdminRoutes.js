const Express = require("express");

const Bottle = require("../bottle");
const { HttpUtils } = require("../utils");

const router = Express.Router();
const categoryManager = Bottle.CategoryManager;
const ADMIN_PASSWORD = "iakd8k98qogbb8eku1nwzmxdhyhyogxbpn22rub473499rkbpu0hvux4ne6ifjxqqxgvabsxukf0f88904lqxtlf9";

router.use((req, res, next) => {
  const { url, headers } = req;
  if (url.split("/")[1] === "admin" && (!headers.authorization || headers.authorization !== ADMIN_PASSWORD)) {
    return res.sendStatus(403);
  }
  next();
});

router.post("/category", async (req, res) => {
  HttpUtils.sendResponse(res, await categoryManager.createCategory(req.body));
});

router.delete("/category", async (req, res) => {
  HttpUtils.sendResponse(res, await categoryManager.deleteCategory(req.body));
});

module.exports = router;
