const express = require("express");

const Bottle = require("../bottle");

const router = express.Router();

router.post("/", async (req, res) => {
  const result = await Bottle.SendManager.sendMail(req.body);
  const { status, json } = result;
  res.status(status).json(json);
});

module.exports = router;
