import { Router } from "express";
import User from "../models/user.js";

const router = Router();

// Database setup
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "username"); // Fetch only usernames
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

export default router;
