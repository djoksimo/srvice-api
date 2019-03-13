const Express = require("express");

const Bottle = require("../bottle");
const { HttpUtils } = require("../utils");

const router = Express.Router();
const bookingManager = Bottle.BookingManager;

router.post("/agent/accept", async (req, res) => {
  HttpUtils.sendResponse(res, await bookingManager.acceptBookingAgent(req.body));
});

router.post("/user/accept", async (req, res) => {
  HttpUtils.sendResponse(res, await bookingManager.acceptBookingUser(req.body));
});

module.exports = router;
