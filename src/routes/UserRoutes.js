const express = require("express");

const {
  cradle: { userManager },
} = require("../container");
const { HttpUtils } = require("../utils");

const router = express.Router();
// TODO: secure this

router.get("/:id", async (req, res) => {
  HttpUtils.sendResponse(res, await userManager.getUserById(req.params));
});

router.patch("/", async (req, res) => {
  HttpUtils.sendResponse(res, await userManager.patchUser(req.body));
});

module.exports = router;
