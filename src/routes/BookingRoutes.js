const Express = require("express");

const {
  cradle: { bookingManager, authenticationManager },
} = require("../container");
const { HttpUtils } = require("../utils");

const router = Express.Router();

const isAuthenticated = (req, res, callback) => {
  const authHeaders = HttpUtils.parseAuthHeaders(req);
  authenticationManager
    .authenticateIdEmailToken(authHeaders)
    .then(async () => {
      callback();
    })
    .catch(() => res.status(403).json({}));
};

router.post("/agent/accept", (req, res) =>
  isAuthenticated(req, res, async () => {
    const authHeaders = HttpUtils.parseAuthHeaders(req);
    HttpUtils.sendResponse(res, await bookingManager.acceptBookingAgent(req.body, authHeaders));
  }),
);

router.post("/user/accept", (req, res) =>
  isAuthenticated(req, res, async () => {
    HttpUtils.sendResponse(res, await bookingManager.acceptBookingUser(req.body));
  }),
);

module.exports = router;
