const express = require("express");
const app = express();
require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Create HTTP server
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Import Routes
const userData = require("./Routes/userData.js");
const challengeData = require("./Routes/challengeData");
const ActiveChallengeRouter = require("./Routes/ActivechallengeRouter.js");
const flaskRoutes = require("./Routes/flaskRoutes.js");  // Import Flask API routes
const Historyrouter = require("./Routes/History.js");
const communityData = require("./Routes/Community");
const router = require("./Routes/communityChallengeRouter");

// Use Routes
app.use("/api/users", userData);
app.use("/api/challenges", challengeData);
app.use("/ActiveChallenge", ActiveChallengeRouter);
app.use("/flask", flaskRoutes); // Mount Flask APIs under `/flask`
app.use("/history" , Historyrouter)
app.use("/community" , communityData)
app.use("/communityChallenge" , router);

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Node.js server running on http://localhost:${PORT}`);
});


