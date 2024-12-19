// import { Router } from "express";
// // import BreakScheduleService from "../services/breakservice.js";
// import GenerateWeeklyBreaks from "../services/generateWeeklyBreaks.js";

// const router = Router();

// const breakgenerator = new GenerateWeeklyBreaks();

// // // Home Dashboard
// // router.get("/breaks/today", async (req, res) => {
// //   try {
// //     const todayBreaks = await BreakScheduleService.getTodaysBreaks(req.user.id);
// //     res.status(200).json(todayBreaks);
// //   } catch (error) {
// //     res.status(500).json({
// //       message: "Failed to fetch today's breaks",
// //       error: error.message,
// //     });
// //   }
// // });

// // router.get("/notifications", async (req, res) => {
// //   try {
// //     const notifications = await BreakScheduleService.getNotifications(
// //       req.user.id
// //     );
// //     res.status(200).json(notifications);
// //   } catch (error) {
// //     res
// //       .status(500)
// //       .json({ message: "Failed to fetch notifications", error: error.message });
// //   }
// // });

// // // My Breaks
// // router.get("/breaks/weekly", async (req, res) => {
// //   try {
// //     const weeklyBreaks = await BreakScheduleService.getWeeklyBreaks(
// //       req.user.id
// //     );
// //     res.status(200).json(weeklyBreaks);
// //   } catch (error) {
// //     res
// //       .status(500)
// //       .json({ message: "Failed to fetch weekly breaks", error: error.message });
// //   }
// // });

// // // Break Swaps
// // router.post("/breaks/swap", async (req, res) => {
// //   try {
// //     const swapRequest = await BreakScheduleService.requestBreakSwap(
// //       req.user.id,
// //       req.body
// //     );
// //     res.status(201).json(swapRequest);
// //   } catch (error) {
// //     res.status(500).json({
// //       message: "Failed to submit break swap request",
// //       error: error.message,
// //     });
// //   }
// // });

// // router.get("/breaks/available-for-swap", async (req, res) => {
// //   try {
// //     const availableBreaks =
// //       await BreakScheduleService.getAvailableBreaksForSwap(req.user.id);
// //     res.status(200).json(availableBreaks);
// //   } catch (error) {
// //     res.status(500).json({
// //       message: "Failed to fetch available breaks for swap",
// //       error: error.message,
// //     });
// //   }
// // });

// // // Schedule Break
// // router.post("/breaks/schedule", async (req, res) => {
// //   try {
// //     const scheduledBreak = await BreakScheduleService.scheduleBreak(
// //       req.user.id,
// //       req.body
// //     );
// //     res.status(201).json(scheduledBreak);
// //   } catch (error) {
// //     res
// //       .status(500)
// //       .json({ message: "Failed to schedule break", error: error.message });
// //   }
// // });

// // router.get("/break-types", async (req, res) => {
// //   try {
// //     const breakTypes = await BreakScheduleService.getBreakTypes();
// //     res.status(200).json(breakTypes);
// //   } catch (error) {
// //     res
// //       .status(500)
// //       .json({ message: "Failed to fetch break types", error: error.message });
// //   }
// // });

// // // Agents on Break
// // router.get("/breaks/current", async (req, res) => {
// //   try {
// //     const agentsOnBreak = await BreakScheduleService.getAgentsOnBreak();
// //     res.status(200).json(agentsOnBreak);
// //   } catch (error) {
// //     res.status(500).json({
// //       message: "Failed to fetch agents currently on break",
// //       error: error.message,
// //     });
// //   }
// // });

// // // Break Service (Existing Route)
// // router.post("/generate-breaks", async (req, res) => {
// //   try {
// //     const breaks = await BreakScheduleService.generateWeeklyBreaksForAllUsers();
// //     res.status(200).json({
// //       message: "Breaks generated successfully",
// //       breaks,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       message: "Failed to generate breaks",
// //       error: error.message,
// //     });
// //   }
// // });

// router.get("/morning-breaks", async (req, res) => {
//   try {
//     const breaks = await breakgenerator.morningBreaks();
//     res.status(200).json({
//       message: "Monring Breaks generated successfully in the database",
//       breaks,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to generate morning breaks",
//       error: error.message,
//     });
//   }
// });
// router.get("/afternoon-breaks", async (req, res) => {
//   try {
//     const breaks = await breakgenerator.afternoonBreaks();
//     res.status(200).json({
//       message: "Afternoon Breaks generated successfully",
//       breaks,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to generate afternoon breaks",
//       error: error.message,
//     });
//   }
// });
// router.get("/night-breaks", async (req, res) => {
//   try {
//     const breaks = await breakgenerator.nightBreaks();
//     res.status(200).json({
//       message: "Night Breaks generated successfully",
//       breaks,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to generate night breaks",
//       error: error.message,
//     });
//   }
// });

// export default router;
