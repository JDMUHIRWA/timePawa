import { Router } from "express";
import { getUsers } from "../controllers/userControllers.js";

const router = Router();

// Database setup
router.get("/users", getUsers);

export default router;
