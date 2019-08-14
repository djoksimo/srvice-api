const express = require("express");

const Bottle = require("../bottle");
const { HttpUtils } = require("../utils");

const router = express.Router();
const userManager = Bottle.UserManager;
// TODO: secure this

router.get("/:id", async (req, res) => {
  HttpUtils.sendResponse(res, await userManager.getUserById(req.params));
});

router.patch("/", async (req, res) => {
  HttpUtils.sendResponse(res, await userManager.patchUser(req.body));
});

module.exports = router;
