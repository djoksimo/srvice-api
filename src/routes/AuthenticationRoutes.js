const express = require("express");
const Bottle = require("../bottle");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const result = await Bottle.AuthenticationManager.signup(req.body);
  const { status, json } = result;
  res.status(status).json(json);
});

router.post("/login", async (req, res) => {
  const result = await Bottle.AuthenticationManager.login(req.body);
  const { status, json } = result;
  res.status(status).json(json);
});

router.post("/confirm", async (req, res) => {
  const result = await Bottle.AuthenticationManager.confirm(req.body);
  const { status, json } = result;
  res.status(status).json(json);
});

router.post("/resend-confirmation", async (req, res) => {
  const result = await Bottle.AuthenticationManager.resendConfirmation(req.body);
  const { status, json } = result;
  res.status(status).json(json);
});

router.post("/verify", async (req, res) => {
  const result = await Bottle.AuthenticationManager.verifyToken(req.body.token);
  const { status, json } = result;
  res.status(status).json(json);
});

router.post("/verify-google", async (req, res) => {
  const result = await Bottle.AuthenticationManager.verifyGoogle(req.body.googleToken);
  const { status, json } = result;
  res.status(status).json(json);
});

router.post("/signup-google", async (req, res) => {
  const result = await Bottle.AuthenticationManager.signupGoogle(req.body);
  const { status, json } = result;
  res.status(status).json(json);
});

router.post("/login-google", async (req, res) => {
  const result = await Bottle.AuthenticationManager.loginGoogle(req.body);
  const { status, json } = result;
  res.status(status).json(json);
});

module.exports = router;
