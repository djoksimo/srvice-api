const express = require("express");

const {
  cradle: { sendManager },
} = require("../container");

const router = express.Router();

router.post("/", async (req, res) => {
  const result = await sendManager.sendMail(req.body);
  const { status, json } = result;
  res.status(status).json(json);
});

module.exports = router;
