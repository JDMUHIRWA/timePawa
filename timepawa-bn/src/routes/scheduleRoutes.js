import { Router } from "express";
import {
  breakRequest,
  getBreakRequests,
  getRequest,
  updateBreakRequest,
} from "../controllers/scheduleControllers.js";

const router = Router();

router.post("/schedule-breaks", breakRequest);
router.get("/scheduled-breaks", getBreakRequests);
router.get("/scheduled-breaks/:username", getRequest);
router.patch("/scheduled-breaks/:requestId/status", updateBreakRequest);

export default router;
