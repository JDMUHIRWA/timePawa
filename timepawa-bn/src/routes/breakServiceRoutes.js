import { Router } from "express";
import BreakScheduleService from "../services/breakservice.js";

const router = Router();

// Break Service
router.post("/generate-breaks", async (req, res) => {
  try {
    const breaks = await BreakScheduleService.generateWeeklyBreaksForAllUsers();
    console.log("Generated Breaks:", JSON.stringify(breaks, null, 2));
    res.status(200).json({
      message: "Breaks generated successfully",
      breaks,
    });
  } catch (error) {
    console.error("Error generating breaks:", error.message);
    res.status(500).json({
      message: "Failed to generate breaks",
      error: error.message,
    });
  }
});

export default router;
