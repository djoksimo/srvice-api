const Express = require("express");

const { HttpUtils } = require("../utils");
const bottle = require("../bottle");

const router = Express.Router();
const serviceRatingManager = bottle.ServiceRatingManager;

router.post("/", async (req, res) => {
  HttpUtils.sendResponse(res, await serviceRatingManager.createServiceRating(req.body));
});

router.patch("/", async (req, res) => {
  HttpUtils.sendResponse(res, await serviceRatingManager.patchServiceRating(req.body));
});

module.exports = router;
