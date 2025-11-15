// routes/sentiment.js
const express = require("express");
const router = express.Router();
const { analyzeMention } = require("../utils/aiHelperGemini");

router.post("/", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text required" });
  try {
    const analysis = await analyzeMention(text);
    res.json({ sentiment: analysis.sentiment });
  } catch (err) {
    console.error("Sentiment route error:", err);
    res.status(500).json({ error: "Analysis failed" });
  }
});

module.exports = router;
