const Express = require("express");
const multer = require("multer");

const Bottle = require("../bottle");
const { FileValues } = require("../values");
const { HttpUtils, UuidUtils } = require("../utils");

const router = Express.Router();
const fileManager = Bottle.FileManager;
const authenticationManager = Bottle.AuthenticationManager;

const isAuthenticated = (req, res, callback) => {
  const authHeaders = HttpUtils.parseAuthHeaders(req);
  authenticationManager.authenticateIdEmailToken(authHeaders).then(async () => {
    callback();
  }).catch(() => res.status(403).json({}));
};

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
const multerUpload = multer({ storage });

router.post("/upload/pictures/", multerUpload.array("pictures", FileValues.MAX_PICTURE_COUNT),
  (req, res) => isAuthenticated(req, res, async () => {
    HttpUtils.sendResponse(res, await fileManager.uploadPictures(req.files));
  }),
);

module.exports = router;
