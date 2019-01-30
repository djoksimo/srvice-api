const express = require("express");

const bottle = require("../bottle");

const router = express.Router();
const serviceManager = bottle.ServiceManager;

router.post("/", async (req, res) => {
  const result = await serviceManager.create(req.body);
  const { status, json } = result;
  res.status(status).json(json);
});

router.get("/home", async (req, res) => {
  const result = await serviceManager.getHomeScreenServices();
  const { status, json } = result;
  res.status(status).json(json);
});

router.get("/name/:name", async (req, res) => {
  const result = await serviceManager.queryWithName(req.params.name);
  const { status, json } = result;
  res.status(status).json(json);
});

router.get("/category/:categoryId", async (req, res) => {
  const result = await serviceManager.queryWithCategory(req.params.categoryId);
  const { status, json } = result;
  res.status(status).json(json);
});

router.get("/:id", async (req, res) => {
  const result = await serviceManager.find(req.params.id);
  const { status, json } = result;
  res.status(status).json(json);
});

router.get("/", async (req, res) => {
  const result = await serviceManager.get();
  const { status, json } = result;
  res.status(status).json(json);
});

router.get("/limit/twenty", async (req, res) => {
  const result = await serviceManager.getTwenty();
  const { status, json } = result;
  res.status(status).json(json);
});

router.patch("/", async (req, res) => {
  const result = await serviceManager.update(req.body);
  const { status, json } = result;
  res.status(status).json(json);
});

router.delete("/", async (req, res) => {
  const result = await serviceManager.remove(req.body);
  const { status, json } = result;
  res.status(status).json(json);
});

module.exports = router;
