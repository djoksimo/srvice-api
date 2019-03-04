const Express = require("express");

const Bottle = require("../bottle");
const { HttpUtils } = require("../utils");

const router = Express.Router();
const categoryManager = Bottle.CategoryManager;

router.post("/category", async (req, res) => {
  HttpUtils.sendResponse(res, await categoryManager.createCategory(req.body));
});

router.get("/category", async (req, res) => {
  HttpUtils.sendResponse(res, await categoryManager.getAllCategories());
});

router.delete("/category", async (req, res) => {
  HttpUtils.sendResponse(res, await categoryManager.deleteCategory(req.body));
});

module.exports = router;
