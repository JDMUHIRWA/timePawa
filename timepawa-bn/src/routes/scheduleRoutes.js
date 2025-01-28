import { Router } from "express";
import {
  breakRequest,
  getBreakRequests,
  getRequest,
  updateBreakRequest,
  deleteBreakRequest,
} from "../controllers/scheduleControllers.js";

const router = Router();

router.post("/schedule-breaks", breakRequest);
router.get("/scheduled-breaks", getBreakRequests);
router.get("/scheduled-breaks/:username", getRequest);
router.patch("/scheduled-breaks/:requestId/status", updateBreakRequest);
router.delete("/scheduled-breaks/:requestId", deleteBreakRequest);

export default router;
