const Express = require("express");

const {
  cradle: { categoryManager },
} = require("../container");
const { HttpUtils } = require("../utils");

const router = Express.Router();

router.get("/home", async (req, res) => {
  HttpUtils.sendResponse(res, await categoryManager.getHomeCategories());
});

router.get("/:id", async (req, res) => {
  const result = await categoryManager.find(req.params.id);
  const { status, json } = result;
  res.status(status).json(json);
});

module.exports = router;
