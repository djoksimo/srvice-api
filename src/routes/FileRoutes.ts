import { Router } from "express";
import Multer from "multer";
import { extname } from "path";

import { cradle } from "../container";

import { FileValues } from "../values";
import { HttpUtils } from "../utilities";

const { fileManager, authenticationManager } = cradle;

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

const multer = Multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // no larger than 10MB
  },
  fileFilter: (_req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|bmp|gif|webp|psd/;
    const mimeType = fileTypes.test(file.mimetype);
    const extName = fileTypes.test(extname(file.originalname).toLowerCase());

    if (mimeType && extName) {
      return cb(null, true);
    }
    cb(new Error(`Error: File upload only supports the following filetypes - ${fileTypes.toString()}`));
  },
});

router.post("/upload/pictures/", multer.array("pictures", FileValues.MAX_PICTURE_COUNT), (req, res) =>
  isAuthenticated(req, res, async () => {
    HttpUtils.sendResponse(res, await fileManager.uploadPictures(req.files));
  }),
);

export default router;
