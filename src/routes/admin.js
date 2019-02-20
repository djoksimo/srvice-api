const express = require("express");

const Bottle = require("../bottle");

const router = express.Router();

router.post("/category", async (req, res) => {
  const result = await Bottle.AdminManager.createCategory(req.body);
  const { status, json } = result;
  res.status(status).json(json);
});

router.patch("/category", async (req, res) => {
  const result = await Bottle.AdminManager.updateCategory(req.body);
  const { status, json } = result;
  res.status(status).json(json);
});

module.exports = router;
