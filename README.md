# 📌 AI-Powered Brand Tracker — Backend (Node + Express + Gemini AI)

This is the backend for the real-time AI Brand Mention Tracker built for RapidQuest Hiring Challenge.

Handles AI generation, sentiment analysis, topic clustering, spike detection, MongoDB storage, and real-time streaming over Socket.IO.

 #  🚀 Features
  🤖 Gemini AI Integration

Mention generation

Sentiment classification

Topic detection

Brand summaries

# ⚡ Real-Time Streaming

Using Socket.IO:

mention:created

mention:updated

brand:progress

brand:done

# 🗃 MongoDB Storage

Stores mentions

Performs analytics

Provides filtering

# 🔥 REST API Endpoints

/brands/analyze → Generate + analyze mentions

/brands/suggest → AI brand suggestions

/brands/summary → AI global market summary

/mentions → Fetch mentions

/mentions/:id → Fetch one

/health → Server check

# 🛠 Tech Stack
Tech	Purpose
Node.js + Express	Backend API
MongoDB + Mongoose	Database
Socket.IO	Real-time communication
Google Gemini AI API	AI generation & analysis
CORS + dotenv	Utilities
