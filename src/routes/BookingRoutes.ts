import { Router } from "express";

import { cradle } from "../container";
import { HttpUtils } from "../utils";

const { bookingManager, authenticationManager } = cradle;

const router = Router();

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

export default router;
