// utils/aiGenerator.js
const axios = require("axios");

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

async function generateMentionsWithAI(brand, count) {
  const prompt = `
Generate ${count} unique realistic social media mentions about the brand "${brand}".

For each mention return JSON object ONLY with:
- content: text of the mention
- source: one of ["Twitter", "Reddit", "News", "Forum", "Instagram"]
- sentiment: positive | negative | neutral
- topic: product | service | pricing | support | quality | brand | general

Return ONLY JSON array, example:
[
  {"content":"...","source":"Twitter","sentiment":"positive","topic":"product"},
  {"content":"...","source":"Reddit","sentiment":"negative","topic":"support"}
]
  `;

  try {
    const res = await axios.post(
      URL,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const text =
      res.data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

    // Clean JSON
    const cleaned = text.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("AI Generation Error:", err.response?.data || err.message);
    return [];
  }
}

module.exports = { generateMentionsWithAI };
