const express = require("express");

const Bottle = require("../bottle");

const router = express.Router();

router.get("/tree", async(req, res) => {
  const result = await Bottle.CategoryManager.getCategoryTree();
  const { status, json } = result;
  res.status(status).json(json);
});

router.get("/:id", async (req, res) => {
  const result = await Bottle.CategoryManager.find(req.params.id);
  const { status, json } = result;
  res.status(status).json(json);
});

router.get("/", async (req, res) => {
  const result = await Bottle.CategoryManager.get();
  const { status, json } = result;
  res.status(status).json(json);
});

module.exports = router;
