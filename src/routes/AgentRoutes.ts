import { Router } from "express";

import { cradle } from "../container";
import { HttpUtils } from "../utils";

const { agentManager, authenticationManager } = cradle;

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

router.get("/:id", async (req, res) => {
  HttpUtils.sendResponse(res, await agentManager.getAgentById(req.params));
});

router.patch("/", (req, res) =>
  isAuthenticated(req, res, async () => {
    const authHeaders = HttpUtils.parseAuthHeaders(req);
    if (authHeaders.agentId !== req.body._id) {
      res.status(403).json({ error: "Nice try ;)" });
    }
    HttpUtils.sendResponse(res, await agentManager.patchAgent(req.body));
  }),
);

export default router;
