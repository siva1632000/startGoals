import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import router from "./routes/router.js";
import { configurePassport } from "./utils/passport.js";
import passport from "passport";
import { autoSyncDatabase } from "./config/autoSyncDb.js"; // 👈 import sync function
import session from "express-session"; // Import express-session
import { Server } from "socket.io";
import initializeSocketIO from "./services/socketHandler.js";
import http from "http";

// to use  .env file atributes
dotenv.config();

const app = express();

// to convert the http request body to json type or as object
app.use(express.json());

// Serve static files for the web interface
app.use('/live-session/assets', express.static('web/assets'));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://psychometrics.onrender.com",
      "http://startgoals.in",
      "https://startgoals.in",
    ],
  })
);

//autoCreate();

// Use sessions for tracking login state
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport.js
configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", router);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://psychometrics.onrender.com",
      "http://startgoals.in",
      "https://startgoals.in",
    ],
    methods: ["GET", "POST"],
  },
});

initializeSocketIO(io); // Initialize Socket.IO event handlers
app.set("io", io); // Attach io to app for use in routes/controllers


// 🔄 Auto Sync DB then start server
// Export io after initialization but before starting server if needed elsewhere immediately
// For now, exporting after creation is fine as controllers will import it.

// autoSyncDatabase()
//   .then(() => {
app.listen(process.env.SERVER_PORT, () => {
  console.log("🚀 Server running on PORT " + process.env.SERVER_PORT);
});
// })
// .catch((err) => {
//   console.error("💥 Failed to start server due to DB sync error");
// });
