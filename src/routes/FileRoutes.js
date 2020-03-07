const Express = require("express");
const Multer = require("multer");
const path = require("path");

const {
  cradle: { fileManager, authenticationManager },
} = require("../container");

const { FileValues } = require("../values");
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

const multer = Multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // no larger than 10MB
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|bmp|gif|webp|psd/;
    const mimeType = fileTypes.test(file.mimetype);
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

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

module.exports = router;
