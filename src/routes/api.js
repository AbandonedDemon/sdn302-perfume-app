const express = require("express");
const router = express.Router();

// Simple health endpoint to verify API is wired
router.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

module.exports = router;
