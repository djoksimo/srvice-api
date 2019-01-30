const express = require("express");

const Bottle = require("../bottle");

const router = express.Router();

router.post("/pair", async (req, res) => {
  const result = await Bottle.ChatManager.findPairChats(req.body);
  const { status, json } = result;
  res.status(status).json(json);
});

router.post("/", async(req, res) => {
  const result = await Bottle.ChatManager.create(req.body);
  const { status, json } = result;
  res.status(status).json(json);
});

router.post("/email", async (req, res) => {
  const result = await Bottle.ChatManager.findUserChats(req.body);
  const { status, json } = result;
  res.status(status).json(json);
});

router.patch("/", async (req, res) => {
  const result = await Bottle.ChatManager.update(req.body);
  const { status, json } = result;
  res.status(status).json(json);
});

module.exports = router;
