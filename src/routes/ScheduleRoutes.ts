import { Router } from "express";

import { cradle } from "../container";
import { HttpUtils } from "../utils";

const { scheduleManager, authenticationManager } = cradle;

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

router.get("/available-slots", async (req, res) => {
  HttpUtils.sendResponse(res, await scheduleManager.getAvailableSlots(req.query));
});

router.post("/", (req, res) =>
  isAuthenticated(req, res, async () => {
    HttpUtils.sendResponse(res, await scheduleManager.createSchedule(req.body));
  }),
);

router.patch("/", (req, res) =>
  isAuthenticated(req, res, async () => {
    const authHeaders = HttpUtils.parseAuthHeaders(req);
    HttpUtils.sendResponse(res, await scheduleManager.patchSchedule(req.body, authHeaders));
  }),
);

router.patch("/booking", (req, res) =>
  isAuthenticated(req, res, async () => {
    HttpUtils.sendResponse(res, await scheduleManager.addBookingToSchedule(req.body));
  }),
);

export default router;
