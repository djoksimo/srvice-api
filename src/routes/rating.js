const express = require("express");

const Bottle = require("../bottle");

const router = express.Router();

router.post("/", async (req, res) => {
  const result = await Bottle.RatingManager.create(req.body);
  const { status, json } = result;
  res.status(status).json(json);
});


router.get("/email/:email", async (req, res) => {
  const result = await Bottle.RatingManager.queryWithForEmail(req.params.email);
  const { status, json } = result;
  res.status(status).json(json);
});

router.get("/:id", async (req, res) => {
  const result = await Bottle.RatingManager.find(req.params.id);
  const { status, json } = result;
  res.status(status).json(json);
});

router.get("/", async (req, res) => {
  const result = await Bottle.RatingManager.get();
  const { status, json } = result;
  res.status(status).json(json);
});

router.patch("/", async (req, res) => {
  const result = await Bottle.RatingManager.update(req.body);
  const { status, json } = result;
  res.status(status).json(json);
});

router.delete("/", async (req, res) => {
  const result = await Bottle.RatingManager.remove(req.body);
  const { status, json } = result;
  res.status(status).json(json);
});

module.exports = router;
