// utils/mockMentions.js
const Mention = require("../models/Mention");

const SAMPLE_SOURCES = ["Twitter", "Reddit", "News", "Instagram", "Forum"];
const SAMPLE_TEXT = [
  "I love the new product! Works perfectly.",
  "Too expensive — not worth the price.",
  "Support was quick and helpful.",
  "Poor build quality, broke after a week.",
  "Amazing design and comfort.",
  "Terrible service, never replied.",
  "Great value for money.",
  "The latest update improved performance."
];

function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

module.exports = async function generateMockMentions(count = 10, brand = "Unknown", keywords = []) {
  const created = [];
  for (let i = 0; i < count; i++) {
    const content = (rand(SAMPLE_TEXT) + (keywords && keywords.length ? " " + keywords.join(" ") : "")).trim();
    const doc = new Mention({
      brand: brand || "General",
      source: rand(SAMPLE_SOURCES),
      content,
      sentiment: "neutral",
      topic: "general"
    });
    await doc.save();
    created.push(doc);
  }
  return created;
};
