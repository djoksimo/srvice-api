const express = require("express");

const Bottle = require("../bottle");
const { HttpUtils } = require("../utils");
const { AdminCredentials } = require("../values");

const router = express.Router();
const authenticationManager = Bottle.AuthenticationManager;

router.post("/agent/signup", async (req, res) => {
  HttpUtils.sendResponse(res, await authenticationManager.signupAgent(req.body));
});

router.post("/agent/confirm", async (req, res) => {
  HttpUtils.sendResponse(res, await authenticationManager.confirmAgent(req.body));
});

router.post("/agent/login", async (req, res) => {
  HttpUtils.sendResponse(res, await authenticationManager.loginAgent(req.body));
});

router.post("/agent/token", async (req, res) => {
  HttpUtils.sendResponse(res, await authenticationManager.verifyAgentToken(req.body));
});

router.post("/user/signup", async (req, res) => {
  HttpUtils.sendResponse(res, await authenticationManager.signupUser(req.body));
});

router.post("/user/confirm", async (req, res) => {
  HttpUtils.sendResponse(res, await authenticationManager.confirmUser(req.body));
});

router.post("/admin/confirm", async (req, res) => {
  const headerAdminPassword = req.header("Authorization");

  if (AdminCredentials.COGNITO_ADMIN_PWD === headerAdminPassword) {
    HttpUtils.sendResponse(res, await authenticationManager.adminConfirmUser(req.body));
  } else {
    res.status(403).json({});
  }
});

router.post("/user/login", async (req, res) => {
  HttpUtils.sendResponse(res, await authenticationManager.loginUser(req.body));
});

router.post("/user/token", async (req, res) => {
  HttpUtils.sendResponse(res, await authenticationManager.verifyUserToken(req.body));
});

router.post("/resend-confirmation", async (req, res) => {
  HttpUtils.sendResponse(res, await authenticationManager.resendConfirmation(req.body));
});

module.exports = router;
