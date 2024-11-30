import { Router } from "express";
import passport from "passport";
import {
  register,
  login,
  authstatus,
  logout,
  setup2FA,
  verify2FA,
  reset2FA,
} from "../controllers/authController.js";

const router = Router();

//Registration Route
router.post("/register", register);
// Login Route
router.post("/login", passport.authenticate("local"), login);
// Auth status Route
router.get("/status", authstatus);
// Logout Route
router.post("/logout", logout);

// 2FA setup Route
router.post(
  "/setup2fa",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized user" });
  },
  setup2FA
);
// 2FA verify Route
router.post(
  "/verify2fa",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized user" });
  },
  verify2FA
);
// Reset Route
router.post(
  "/reset",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized user" });
  },
  reset2FA
);

export default router;
