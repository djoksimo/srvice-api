const Express = require("express");

const {
  cradle: { offeringManager, authenticationManager },
} = require("../container");
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

router.post("/", (req, res) =>
  isAuthenticated(req, res, async () => {
    const authHeaders = HttpUtils.parseAuthHeaders(req);
    HttpUtils.sendResponse(res, await offeringManager.createOffering(req.body, authHeaders));
  }),
);

router.patch("/", (req, res) =>
  isAuthenticated(req, res, async () => {
    const authHeaders = HttpUtils.parseAuthHeaders(req);
    HttpUtils.sendResponse(res, await offeringManager.patchOffering(req.body, authHeaders));
  }),
);

router.delete("/", (req, res) =>
  isAuthenticated(req, res, async () => {
    const authHeaders = HttpUtils.parseAuthHeaders(req);
    HttpUtils.sendResponse(res, await offeringManager.deleteOffering(req.body, authHeaders));
  }),
);

module.exports = router;
