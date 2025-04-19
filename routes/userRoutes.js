import express from "express";
import {
  userLogin,
  userRegistration,
  googleLogin,
  googleCallback,
  getUserDetails,
} from "../controller/userController.js";
import passport from "passport";

const userRoutes = express.Router();

userRoutes.post("/userRegistration", userRegistration);
userRoutes.post("/userLogin", userLogin);

userRoutes.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

userRoutes.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/api/auth/callback/success",
    failureRedirect: "/api/auth/callback/failure",
  })
);
// Success
userRoutes.get("/auth/callback/success", googleCallback);

// failure
userRoutes.get("/auth/callback/failure", (req, res) => {
  res.send("Error");
});

userRoutes.get("/googlePage", googleLogin);
userRoutes.get("/usersDetailsById/:userId", getUserDetails);

export default userRoutes;
