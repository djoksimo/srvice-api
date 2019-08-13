const Express = require("express");

const Bottle = require("../bottle");
const { HttpUtils } = require("../utils");

const router = Express.Router();
const scheduleManager = Bottle.ScheduleManager;
const authenticationManager = Bottle.AuthenticationManager;

router.post("/", async (req, res) => {
  authenticationManager.authenticateIdEmailToken(HttpUtils.parseAuthHeaders(req)).then(async () => {
    HttpUtils.sendResponse(res, await scheduleManager.createSchedule(req.body));
  }).catch(() => res.status(403).json({}));
});

router.patch("/", async (req, res) => {
  const authHeaders = HttpUtils.parseAuthHeaders(req);
  authenticationManager.authenticateIdEmailToken(authHeaders).then(async () => {
    HttpUtils.sendResponse(res, await scheduleManager.patchSchedule(req.body, authHeaders));
  }).catch(() => res.status(403).json({}));
});

router.patch("/booking", async (req, res) => {
  authenticationManager.authenticateIdEmailToken(HttpUtils.parseAuthHeaders(req)).then(async () => {
    HttpUtils.sendResponse(res, await scheduleManager.addBookingToSchedule(req.body));
  }).catch(() => res.status(403).json({}));
});

module.exports = router;
