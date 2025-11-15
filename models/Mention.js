const mongoose = require("mongoose");

const mentionSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    source: { type: String, default: "manual" },
    content: { type: String, required: true },
    sentiment: { type: String, default: "neutral" },
    topic: { type: String, default: "general" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mention", mentionSchema);
