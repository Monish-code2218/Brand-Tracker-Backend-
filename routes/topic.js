// routes/topic.js
const express = require("express");
const router = express.Router();
const { analyzeMention } = require("../utils/aiHelperGemini");

router.post("/", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text required" });
  try {
    const analysis = await analyzeMention(text);
    res.json({ topic: analysis.topic });
  } catch (err) {
    console.error("Topic route error:", err);
    res.status(500).json({ error: "Analysis failed" });
  }
});

module.exports = router;
