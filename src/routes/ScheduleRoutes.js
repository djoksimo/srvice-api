const Express = require("express");

const Bottle = require("../bottle");
const { HttpUtils } = require("../utils");

const router = Express.Router();
const scheduleManager = Bottle.ScheduleManager;

router.post("/", async (req, res) => {
  HttpUtils.sendResponse(res, await scheduleManager.createSchedule(req.body));
});

router.patch("/", async (req, res) => {
  HttpUtils.sendResponse(res, await scheduleManager.patchSchedule(req.body));
});

router.patch("/booking", async (req, res) => {
  HttpUtils.sendResponse(res, await scheduleManager.addBookingToSchedule(req.body));
});

module.exports = router;
