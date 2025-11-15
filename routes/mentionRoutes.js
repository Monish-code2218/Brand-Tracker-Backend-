// routes/mentions.js
const express = require("express");
const router = express.Router();
const Mention = require("../models/Mention");
const generateMockMentions = require("../utils/mockMentions");
const { analyzeMention } = require("../utils/aiHelperGemini");

// Generate & auto-analyze
router.post("/generate", async (req, res) => {
  const { count = 10, brand, keywords = [] } = req.body;

  try {
    const created = await generateMockMentions(count, brand, keywords);

    // Analyze in parallel but handle per-item failures
    const settled = await Promise.allSettled(
      created.map(async (m) => {
        try {
          const analysis = await analyzeMention(m.content);
          m.sentiment = analysis.sentiment;
          m.topic = analysis.topic;
          await m.save();
          return m;
        } catch (e) {
          console.error("Analyze single mention failed:", e?.message || e);
          return m; // return original doc (unchanged)
        }
      })
    );

    const successful = settled
      .filter((s) => s.status === "fulfilled")
      .map((s) => s.value);

    res.json({
      message: "Generated & analyzed",
      requested: Number(count),
      saved: created.length,
      analyzed: successful.length,
      mentions: created,
    });
  } catch (err) {
    console.error("Generate Error:", err);
    res.status(500).json({ error: "Generate failed: " + (err.message || err) });
  }
});

// Get mentions (filters)
router.get("/", async (req, res) => {
  try {
    const { brand, limit = 100, since } = req.query;
    const filter = {};
    if (brand) filter.brand = brand;
    if (since) filter.createdAt = { $gte: new Date(since) };
    const mentions = await Mention.find(filter).sort({ createdAt: -1 }).limit(Number(limit));
    res.json(mentions);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// get single
router.get("/:id", async (req, res) => {
  try {
    const m = await Mention.findById(req.params.id);
    if (!m) return res.status(404).json({ error: "Not found" });
    res.json(m);
  } catch (err) {
    console.error("Fetch single error:", err);
    res.status(500).json({ error: err.message });
  }
});

// analyze neutral ones (or all)
router.post("/analyze", async (req, res) => {
  try {
    const { onlyNeutral = true, limit = 30 } = req.body;
    const filter = onlyNeutral ? { sentiment: "neutral" } : {};
    const toAnalyze = await Mention.find(filter).limit(Number(limit));
    const settled = await Promise.allSettled(
      toAnalyze.map(async (m) => {
        try {
          const analysis = await analyzeMention(m.content);
          m.sentiment = analysis.sentiment;
          m.topic = analysis.topic;
          await m.save();
          return m;
        } catch (e) {
          console.error("Analyze failed for one:", e);
          return m;
        }
      })
    );
    const analyzed = settled.filter((s) => s.status === "fulfilled").map((s) => s.value);
    res.json({ message: "Analysis complete", requested: toAnalyze.length, analyzed: analyzed.length });
  } catch (err) {
    console.error("Analyze Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// test single
router.post("/test/sentiment", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text required" });
    const analysis = await analyzeMention(text);
    res.json(analysis);
  } catch (err) {
    console.error("Test Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
