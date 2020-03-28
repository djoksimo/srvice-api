import { Router } from "express";

import { cradle } from "../container";
import { HttpUtils } from "../utilities";

const { categoryManager } = cradle;

const router = Router();

router.get("/home", async (req, res) => {
  HttpUtils.sendResponse(res, await categoryManager.getHomeCategories());
});

router.get("/:id", async (req, res) => {
  const result = await categoryManager.find(req.params.id);
  const { status, json } = result;
  res.status(status).json(json);
});

export default router;
