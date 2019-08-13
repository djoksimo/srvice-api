const Express = require("express");

const Bottle = require("../bottle");
const { HttpUtils } = require("../utils");

const router = Express.Router();
const bookingManager = Bottle.BookingManager;
const authenticationManager = Bottle.AuthenticationManager;

router.post("/agent/accept", async (req, res) => {
  const authHeaders = HttpUtils.parseAuthHeaders(req);
  authenticationManager.authenticateIdEmailToken(authHeaders).then(async () => {
    HttpUtils.sendResponse(res, await bookingManager.acceptBookingAgent(req.body, authHeaders));
  }).catch(() => res.status(403).json({}));
});

router.post("/user/accept", async (req, res) => {
  authenticationManager.authenticateIdEmailToken(HttpUtils.parseAuthHeaders(req)).then(async () => {
    HttpUtils.sendResponse(res, await bookingManager.acceptBookingUser(req.body));
  }).catch(() => res.status(403).json({}));
});

module.exports = router;
