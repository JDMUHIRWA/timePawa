import { Router } from "express";
import {
  swapRequest,
  getSwapRequests,
  getUserSwapRequests,
  updateSwapRequest,
} from "../controllers/swapControllers.js";

const router = Router();

router.post("/swap-requests", swapRequest);
router.get("/swap-requests", getSwapRequests);
router.get("/swap-requests/:username", getUserSwapRequests);
router.patch("/swap-requests/:requestId/status", updateSwapRequest);

export default router;
