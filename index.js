// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import sequelize from "./config/db.js";
// import router from "./routes/router.js";
// import { configurePassport } from "./utils/passport.js";
// import passport from "passport";
// import { autoSyncDatabase } from "./config/autoSyncDb.js"; // 👈 import sync function
// import session from "express-session"; // Import express-session

// // to use  .env file atributes
// dotenv.config();

// const app = express();

// // to convert the http request body to json type or as object
// app.use(express.json());

// app.use(
//   cors({
//     origin: ["http://localhost:5173", "https://psychometrics.onrender.com"],
//   })
// );

// //autoCreate();

// // Use sessions for tracking login state
// app.use(
//   session({
//     secret: "your-secret-key",
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// // Initialize Passport.js
// configurePassport(passport);
// app.use(passport.initialize());
// app.use(passport.session());

// app.use("/api", router);

// // 🔄 Auto Sync DB then start server
// autoSyncDatabase()
//   .then(() => {
//     app.listen(process.env.SERVER_PORT, () => {
//       console.log("🚀 Server running on PORT " + process.env.SERVER_PORT);
//     });
//   })
//   .catch((err) => {
//     console.error("💥 Failed to start server due to DB sync error");
//   });


import express from "express";
import cors from "cors";
import sequelize from "./config/db.js"; // db.js will also need inlined values
import router from "./routes/router.js";
import { configurePassport } from "./utils/passport.js";
import passport from "passport";
import { autoSyncDatabase } from "./config/autoSyncDb.js";
import session from "express-session";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://psychometrics.onrender.com"],
  })
);

// Session setup
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport setup
configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api", router);

// Sync DB then start server
autoSyncDatabase()
  .then(() => {
    app.listen(3000, () => {
      console.log("🚀 Server running on PORT 3000");
    });
  })
  .catch((err) => {
    console.error("💥 Failed to start server due to DB sync error");
  });

