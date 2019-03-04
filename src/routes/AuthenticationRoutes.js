const express = require("express");

const Bottle = require("../bottle");
const { HttpUtils } = require("../utils");

const router = express.Router();
const authenticationManager = Bottle.AuthenticationManager;

router.post("/signup", async (req, res) => {
  HttpUtils.sendResponse(res, await authenticationManager.signup(req.body));
});

router.post("/login", async (req, res) => {
  HttpUtils.sendResponse(res, await authenticationManager.login(req.body));
});

router.post("/confirm", async (req, res) => {
  HttpUtils.sendResponse(res, await authenticationManager.confirm(req.body));
});

router.post("/resend-confirmation", async (req, res) => {
  HttpUtils.sendResponse(res, await authenticationManager.resendConfirmation(req.body));
});

router.post("/verify", async (req, res) => {
  HttpUtils.sendResponse(res, await authenticationManager.verifyToken(req.body.token));
});

router.post("/verify-google", async (req, res) => {
  HttpUtils.sendResponse(res, await authenticationManager.verifyGoogle(req.body.googleToken));
});

router.post("/signup-google", async (req, res) => {
  HttpUtils.sendResponse(res, await authenticationManager.signupGoogle(req.body));
});

router.post("/login-google", async (req, res) => {
  HttpUtils.sendResponse(res, await authenticationManager.loginGoogle(req.body));
});

module.exports = router;
