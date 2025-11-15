const express = require("express");
const router = express.Router();
const Mention = require("../models/Mention");
const { generateMentionsWithAI } = require("../utils/aiGenerator");

router.post("/analyze", async (req, res) => {
  const io = req.app.locals.io;
  const { brand, count = 20 } = req.body;

  try {
    // 1️⃣ AI generates mentions WITH sentiment + topic included
    const aiMentions = await generateMentionsWithAI(brand, count);

    const saved = [];

    for (let i = 0; i < aiMentions.length; i++) {
      const m = aiMentions[i];

      const doc = await Mention.create({
        brand,
        content: m.content,
        source: m.source,
        sentiment: m.sentiment,
        topic: m.topic
      });

      // Real-time UI: new raw mention
      io.emit("mention:created", { mention: doc });

      saved.push(doc);

      // Real-time progress feedback
      io.emit("brand:progress", {
        brand,
        processed: i + 1,
        total: aiMentions.length
      });

      await new Promise((r) => setTimeout(r, 200)); // slight delay for effect
    }

    // 2️⃣ Aggregation for insights
    const mentions = await Mention.find({ brand }).sort({ createdAt: -1 });

    const sentimentCounts = mentions.reduce(
      (acc, m) => {
        acc[m.sentiment] = (acc[m.sentiment] || 0) + 1;
        return acc;
      },
      { positive: 0, neutral: 0, negative: 0 }
    );

    const topicCounts = {};
    mentions.forEach((m) => {
      topicCounts[m.topic] = (topicCounts[m.topic] || 0) + 1;
    });

    const finalInsights = {
      sentimentCounts,
      topTopics: Object.entries(topicCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([topic, count]) => ({ topic, count }))
    };

    // 3️⃣ Real-time final summary event
    io.emit("brand:done", finalInsights);

    res.json({
      message: "AI tracking completed",
      ...finalInsights
    });
  } catch (err) {
    console.error("Analyze error:", err);
    res.status(500).json({ error: "AI processing failed" });
  }
});

module.exports = router;
