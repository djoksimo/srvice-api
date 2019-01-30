const express = require("express");
const Bottle = require("../bottle");

const router = express.Router();

router.get("/:id", async (req, res) => {
  const result = await Bottle.UserManager.find(req.params.id);
  const { status, json } = result;
  res.status(status).json(json);
});

router.get("/agent/:id", async (req, res) => {
  const result = await Bottle.UserManager.findById(req.params.id);
  const { status, json } = result;
  res.status(status).json(json);
});

router.get("/", async (req, res) => {
  const result = await Bottle.UserManager.get();
  const { status, json } = result;
  res.status(status).json(json);
});

router.patch("/", async (req, res) => {
  const result = await Bottle.UserManager.update(req.body);
  const { status, json } = result;
  res.status(status).json(json);
});

module.exports = router;
