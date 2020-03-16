import { Router } from "express";

import { cradle } from "../container";
import { HttpUtils } from "../utils";

const { userManager } = cradle;

const router = Router();
// TODO: secure this

router.get("/:id", async (req, res) => {
  HttpUtils.sendResponse(res, await userManager.getUserById(req.params));
});

router.patch("/", async (req, res) => {
  HttpUtils.sendResponse(res, await userManager.patchUser(req.body));
});

export default router;
