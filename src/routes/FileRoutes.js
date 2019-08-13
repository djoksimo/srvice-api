const Express = require("express");
const multer = require("multer");

const Bottle = require("../bottle");
const { FileValues } = require("../values");
const { HttpUtils, UuidUtils } = require("../utils");

const router = Express.Router();
const fileManager = Bottle.FileManager;
const authenticationManager = Bottle.AuthenticationManager;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "tmp/");
  },
  filename: (req, file, cb) => {
    // Now that's secure 🔐
    const secureFileName = `${UuidUtils.generateUUID()}`;
    cb(null, secureFileName);
  },
});

// TODO: validate file type and size using multer fileFilter
const upload = multer({ storage });

router.post("/upload/pictures/", upload.array("pictures", FileValues.MAX_PICTURE_COUNT), async (req, res) => {
  const authHeaders = HttpUtils.parseAuthHeaders(req);
  authenticationManager.authenticateIdEmailToken(authHeaders).then(async () => {
    HttpUtils.sendResponse(res, await fileManager.uploadPictures(req.files));
  }).catch(() => res.status(403).json({}));
});

module.exports = router;
