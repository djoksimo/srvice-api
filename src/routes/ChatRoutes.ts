import { Router } from "express";

import { cradle } from "../container";
import { HttpUtils } from "../utilities";

const { authenticationManager, chatManager } = cradle;

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

router.post("/auth", (req, res) =>
  isAuthenticated(req, res, async () => {
    HttpUtils.sendResponse(res, await chatManager.authenticateUser(req));
  }),
);

router.post("/user", (req, res) =>
  isAuthenticated(req, res, async () => {
    HttpUtils.sendResponse(res, await chatManager.createChatUser(req.body));
  }),
);

router.post("/start", (req, res) =>
  isAuthenticated(req, res, async () => {
    HttpUtils.sendResponse(res, await chatManager.startConversation(req.body));
  }),
);

router.patch("/update-user", (req, res) =>
  isAuthenticated(req, res, async () => {
    HttpUtils.sendResponse(res, await chatManager.updateUser(req.body));
  }),
);

export default router;
