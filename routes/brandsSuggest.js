const express = require("express");
const axios = require("axios");
const router = express.Router();

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-1.5-flash";

router.post("/suggest", async (req, res) => {
  const { q } = req.body;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

  const prompt = `
Suggest real global brands related to: "${q}"
Return ONLY JSON array, example:
["Nike","Adidas","Puma"]
`;

  try {
    const response = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    res.json({ suggestions: parsed });
  } catch (err) {
    res.json({
      suggestions: ["Nike", "Apple", "Amazon", "Tesla", "Adidas", "Samsung"]
    });
  }
});

module.exports = router;
