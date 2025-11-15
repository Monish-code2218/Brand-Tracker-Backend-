import Mention from "../models/mentionModel.js";
import { analyzeSentiment, detectTopic } from "../utils/aiHelperHF.js";

export const generateMention = async (req, res) => {
  try {
    const { text, brand, source } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    // AI Calls
    const sentiment = await analyzeSentiment(text);
    const topic = await detectTopic(text);

    // Save correctly to schema
    const mention = await Mention.create({
      brand,
      source,
      content: text,   // FIXED — matches schema
      sentiment,
      topic
    });

    res.json(mention);
  } catch (e) {
    console.error("ERROR generating mention:", e);
    res.status(500).json({ error: "Something went wrong" });
  }
};
