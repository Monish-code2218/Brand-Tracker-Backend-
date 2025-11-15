// utils/aiHelperGemini.js
const axios = require("axios");

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

// Clean JSON safely from Gemini text output
function extractJSON(text) {
  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e2) {}
    }
    return null;
  }
}

/* ------------------------------
   1) SENTIMENT ANALYSIS
------------------------------ */
async function analyzeSentiment(content) {
  const prompt = `
Analyze the sentiment of this text:
"${content}"

Give answer strictly as JSON:
{
  "sentiment": "positive" | "neutral" | "negative"
}
`;

  try {
    const response = await axios.post(
      GEMINI_URL,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const parsed = extractJSON(text);

    return parsed?.sentiment || "neutral";
  } catch (err) {
    console.error("Gemini SENTIMENT error:", err.response?.data || err.message);
    return "neutral";
  }
}

/* ------------------------------
   2) TOPIC CLASSIFICATION
------------------------------ */
async function detectTopic(content) {
  const prompt = `
Classify this text into a topic:

Text: "${content}"

Allowed topics:
["product","service","pricing","quality","support","brand","general"]

Return strictly JSON:
{
  "topic": "product" | "service" | "pricing" | "quality" | "support" | "brand" | "general"
}
`;

  try {
    const response = await axios.post(
      GEMINI_URL,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const parsed = extractJSON(text);

    return parsed?.topic || "general";
  } catch (err) {
    console.error("Gemini TOPIC error:", err.response?.data || err.message);
    return "general";
  }
}

/* ------------------------------
   3) COMPLETE MENTION ANALYSIS
------------------------------ */
async function analyzeMention(text) {
  const sentiment = await analyzeSentiment(text);
  const topic = await detectTopic(text);

  return { sentiment, topic };
}

module.exports = {
  analyzeMention,
  analyzeSentiment,
  detectTopic
};
