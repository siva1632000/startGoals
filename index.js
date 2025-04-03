import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
//import autoCreate from "./config/tableCreationConfig.js";
import router from "./routes/router.js";
import { configurePassport } from "./utils/passport.js";
import passport from "passport";
import session from "express-session"; // Import express-session

// to use  .env file atributes
dotenv.config();

const app = express();

// to convert the http request body to json type or as object
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://psychometrics.onrender.com"],
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

app.use(router);

// PORT connection from .env file
app.listen(process.env.SERVER_PORT, () => {
  console.log("Server running on PORT " + process.env.SERVER_PORT);
});
