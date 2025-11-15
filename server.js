// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

const mentionsRouter = require("./routes/mentionRoutes");
const brandsRouter = require("./routes/brands");
const sentimentRoute = require("./routes/sentiment");
const topicRoute = require("./routes/topic");
const healthRoutes = require("./routes/healthRoutes");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// create HTTP server and socket.io
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" } // restrict origin in production
});

// make io available to routes via app.locals
app.locals.io = io;

// routes
app.use("/api/health", healthRoutes);
app.use("/api/mentions", mentionsRouter);
app.use("/api/brands", brandsRouter);
app.use("/api/sentiment", sentimentRoute);
app.use("/api/topic", topicRoute);

// catch-all api 404
app.use("/api", (req, res) => res.status(404).json({ error: "API route not found" }));

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// socket.io connection logging
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("disconnect", () => console.log("Socket disconnected:", socket.id));
});
