const express = require("express");

const Bottle = require("../bottle");
const { HttpUtils } = require("../utils");

const router = express.Router();
const userManager = Bottle.UserManager;

router.get("/:id", async (req, res) => {
  HttpUtils.sendResponse(res, await userManager.findById(req.params.id));
});

router.get("/", async (req, res) => {
  HttpUtils.sendResponse(res, await userManager.get());
});

router.patch("/", async (req, res) => {
  HttpUtils.sendResponse(res, await userManager.updateUser(req.body));
});

module.exports = router;
