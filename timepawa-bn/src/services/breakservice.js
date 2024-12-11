import moment from "moment";
import User from "../models/user.js";
import GeneratedBreak from "../models/generatedbreaks.js";
import BreakValidationMiddleware from "./breakValidationMiddleware.js";
import BreakRandomizationService from "./breakRandomizationService.js";
import BreakPatternAnalysisService from "./breakPatternAnalysisService.js";
import logger from "../utils/logger.js";
import breakConfig from "../config/breakConfig.js";

class BreakScheduleService {
  // Shift determination remains similar to previous implementation
  static determineUserShift(currentTime = moment()) {
    const hour = currentTime.hour();

    if (hour >= 7 && hour <= 16) {
      return "MORNING_SHIFT";
    } else if (hour >= 16 && hour <= 24) {
      return "EVENING_SHIFT";
    } else {
      return "NIGHT_SHIFT";
    }
  }

  // Enhanced break generation with new randomization and validation
  static async generateDynamicBreaks(user, currentTime = moment()) {
    try {
      // Fetch user's break history for more personalized randomization
      const userBreakHistory =
        await BreakPatternAnalysisService.analyzeUserBreakPatterns(
          user._id,
          7 // Look at past 1 week of break history !!!!!!!!
        );

      const shiftBreakTemplates = this.getShiftBreakTemplates();
      const userShift = this.determineUserShift(currentTime);
      const breakTypes = ["SCREEN_BREAK_1", "LUNCH_BREAK", "SCREEN_BREAK_2"];

      const generatedBreaks = await Promise.all(
        breakTypes.map(async (breakType, index) => {
          const breakTemplates = shiftBreakTemplates[userShift];
          if (!breakTemplates) {
            throw new Error(`No break templates found for shift: ${userShift}`);
          }

          const selectedTemplate = breakTemplates[index];
          const [startTimeStr, endTimeStr] = selectedTemplate.timeRange;
          const startTime = moment(currentTime).set({
            hour: parseInt(startTimeStr.split(":")[0]),
            minute: parseInt(startTimeStr.split(":")[1]),
          });
          const endTime = moment(currentTime).set({
            hour: parseInt(endTimeStr.split(":")[0]),
            minute: parseInt(endTimeStr.split(":")[1]),
          });

          // Use advanced randomization
          const breakStartTime =
            BreakRandomizationService.generateWeightedRandomBreakTime(
              startTime.toDate(),
              endTime.toDate(),
              userBreakHistory.breakTimings
            );

          const breakDuration = this.getBreakDuration(user, breakType);

          const breakItem = {
            type: breakType,
            shift: userShift,
            slot: selectedTemplate.slot,
            startTime: breakStartTime,
            endTime: moment(breakStartTime)
              .add(breakDuration, "minutes")
              .toDate(),
            status: "PENDING",
            userId: user._id,
            username: user.username,
          };

          return breakItem;
        })
      );

      // Validate generated breaks
      const validationResults =
        await BreakValidationMiddleware.validateBreakGeneration(
          generatedBreaks
        );

      // Filter out invalid breaks
      const validBreaks = validationResults
        .filter((result) => result.isValid)
        .map((result) => result.break);

      // Log any validation errors
      const invalidBreaks = validationResults.filter(
        (result) => !result.isValid
      );

      if (invalidBreaks.length > 0) {
        logger.warn("Some breaks failed validation", {
          invalidBreaks: invalidBreaks.map((b) => ({
            break: b.break,
            error: b.overlapError,
          })),
        });
      }

      return validBreaks;
    } catch (error) {
      logger.error("Error generating dynamic breaks", {
        error,
        userId: user._id,
      });
      throw error;
    }
  }

  // Break duration calculation (similar to previous implementation)
  static getBreakDuration(user, breakType) {
    const breakAllowance = user.breakAllowance || {};
    const config = breakConfig.breakDurations;

    switch (breakType) {
      case "SCREEN_BREAK_1":
      case "SCREEN_BREAK_2":
        return breakAllowance.screenBreakDuration || config.screenBreak;
      case "LUNCH_BREAK":
        return breakAllowance.lunchBreakDuration || config.lunchBreak;
      default:
        return config.screenBreak;
    }
  }

  // Shift break templates (similar to previous implementation)
  static getShiftBreakTemplates() {
    return {
      MORNING_SHIFT: [
        { slot: "EARLY_MORNING", timeRange: ["09:00", "11:00"] },
        { slot: "MIDDAY", timeRange: ["11:00", "14:00"] },
        { slot: "LATE_AFTERNOON", timeRange: ["14:00", "15:00"] },
      ],
      EVENING_SHIFT: [
        { slot: "EARLY_EVENING", timeRange: ["17:00", "19:00"] },
        { slot: "LATE_EVENING", timeRange: ["19:00", "22:00"] },
        { slot: "NIGHT_TRANSITION", timeRange: ["22:00", "23:00"] },
      ],
      NIGHT_SHIFT: [
        { slot: "EARLY_NIGHT", timeRange: ["01:00", "03:00"] },
        { slot: "MIDNIGHT", timeRange: ["03:00", "06:00"] },
        { slot: "EARLY_MORNING", timeRange: ["06:00", "07:00"] },
      ],
    };
  }

  // Save generated breaks with improved error handling
  static async saveGeneratedBreaks(user, breaks) {
    try {
      // Team coverage validation
      const coverageValidation =
        await BreakValidationMiddleware.validateTeamCoverage(breaks);

      // Check if team coverage is acceptable
      const insufficientCoverage = coverageValidation.some(
        (shift) => !shift.isValidCoverage
      );

      if (insufficientCoverage) {
        logger.warn("Potential insufficient team coverage", {
          coverageValidation,
        });
        // Optionally throw an error or adjust breaks
      }

      const savedBreaks = await GeneratedBreak.insertMany(
        breaks.map((breakItem) => ({
          ...breakItem,
          userId: user._id,
          username: user.username,
        }))
      );

      logger.info(
        `Generated ${savedBreaks.length} breaks for user ${user.username}`
      );
      return savedBreaks;
    } catch (error) {
      logger.error(`Error saving breaks for user ${user.username}`, { error });
      throw error;
    }
  }

  // Generate breaks for all users with improved processing
  static async generateWeeklyBreaksForAllUsers() {
    try {
      const agents = await User.find({ role: "AGENT" });

      // Use Promise.all for concurrent break generation
      const breakGenerationPromises = agents.map(async (agent) => {
        try {
          const generatedBreaks = await this.generateDynamicBreaks(agent);
          return this.saveGeneratedBreaks(agent, generatedBreaks);
        } catch (agentBreakError) {
          logger.error(
            `Failed to generate breaks for agent ${agent.username}`,
            {
              error: agentBreakError,
            }
          );
          // Optionally return an empty array or handle individually
          return [];
        }
      });

      const allBreaks = await Promise.all(breakGenerationPromises);

      // Flatten and filter out any empty arrays
      const flattenedBreaks = allBreaks.flat().filter(Boolean);

      logger.info(`Total breaks generated: ${flattenedBreaks.length}`);
      return flattenedBreaks;
    } catch (error) {
      logger.error("Error generating weekly breaks", { error });
      throw error;
    }
  }
  static async getTodaysBreaks(userId) {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of the day
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // End of the day

      const breaks = await GeneratedBreak.find({
        userId,
        startTime: { $gte: startOfDay, $lte: endOfDay },
      });
      return breaks;
    } catch (error) {
      console.error("Error fetching today's breaks:", error);
      throw new Error("Failed to fetch today's breaks.");
    }
  }

  // Fetch the weekly breaks for a user
  static async getWeeklyBreaks(userId) {
    try {
      const today = new Date();
      const startOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay())
      ); // Start of the week (Sunday)
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // End of the week (Saturday)

      const breaks = await GeneratedBreak.find({
        userId,
        startTime: { $gte: startOfWeek, $lte: endOfWeek },
      });
      return breaks;
    } catch (error) {
      console.error("Error fetching weekly breaks:", error);
      throw new Error("Failed to fetch weekly breaks.");
    }
  }

  // Request a break swap
  static async requestBreakSwap(userId, swapDetails) {
    try {
      const { breakId, swapWithBreakId, reason } = swapDetails;

      // Find the break the user wants to swap
      const breakToSwap = await GeneratedBreak.findOne({
        _id: breakId,
        userId,
      });
      if (!breakToSwap) {
        throw new Error("Break not found or invalid user.");
      }

      // Find the target break for the swap
      const targetBreak = await GeneratedBreak.findById(swapWithBreakId);
      if (!targetBreak) {
        throw new Error("Target break not found.");
      }

      // Update the break statuses
      const result = await GeneratedBreak.updateMany(
        { _id: { $in: [breakId, swapWithBreakId] } },
        {
          $set: {
            status: "SWAP_REQUESTED",
            requestedBy: userId,
            reason: reason || "No reason provided.",
          },
        }
      );

      if (result.nModified !== 2) {
        throw new Error("Failed to update both breaks. Swap request aborted.");
      }

      return {
        message: "Swap request submitted successfully.",
        breaks: { breakToSwap, targetBreak },
      };
    } catch (error) {
      console.error("Error submitting break swap request:", error);
      throw new Error("Failed to submit break swap request.");
    }
  }

  // Fetch breaks eligible for swapping
  static async getAvailableBreaksForSwap(userId) {
    try {
      const breaks = await GeneratedBreak.find({
        userId: { $ne: userId }, // Exclude the current user's breaks
        status: "PENDING", // Only pending breaks are eligible
      });
      return breaks;
    } catch (error) {
      console.error("Error fetching available breaks for swap:", error);
      throw new Error("Failed to fetch available breaks for swap.");
    }
  }

  // Schedule a new break
  static async scheduleBreak(userId, breakDetails) {
    try {
      const { username, type, shift, slot, startTime, endTime } = breakDetails;

      // Create a new break entry
      const newBreak = new GeneratedBreak({
        userId,
        username,
        type,
        shift,
        slot,
        startTime,
        endTime,
        status: "PENDING",
      });

      await newBreak.save();
      return {
        message: "Break scheduled successfully.",
        breakId: newBreak._id,
      };
    } catch (error) {
      console.error("Error scheduling break:", error);
      throw new Error("Failed to schedule break.");
    }
  }

  // Fetch all available break types
  static async getBreakTypes() {
    try {
      // Since break types are enums in your schema, we can return them directly
      return ["SCREEN_BREAK_1", "LUNCH_BREAK", "SCREEN_BREAK_2"];
    } catch (error) {
      console.error("Error fetching break types:", error);
      throw new Error("Failed to fetch break types.");
    }
  }

  // Fetch all agents currently on break
  static async getAgentsOnBreak() {
    try {
      const now = new Date();

      const agentsOnBreak = await GeneratedBreak.find({
        startTime: { $lte: now },
        endTime: { $gte: now },
        status: "PENDING", // Assume "PENDING" means the break is ongoing
      }).populate("userId", "username"); // Populate user details

      return agentsOnBreak;
    } catch (error) {
      console.error("Error fetching agents on break:", error);
      throw new Error("Failed to fetch agents currently on break.");
    }
  }
  // Notifiations
  static async getNofiications() {
    try {
      // fetch break swap requests
      const breakSwapRequests = await GeneratedBreak.find({
        userId,
        status: "SWAP_REQUESTED",
      }).populate("userId", "username");

      // fetch supervisor approved breaks
      const supervisorApprovedBreaks = await GeneratedBreak.find({
        userId,
        status: "SUPERVISOR_APPROVED",
        $or: [{ type: "COACHING", type: "MEETING", type: "TRAINING" }],
      }).populate("apporvedBy", "username");

      // Transform break swap requests into notifications objects
      const swapRequestNotifications = breakSwapRequests.map((request) => ({
        id: request._id,
        type: "BREAK_SWAP_REQUEST",
        message: `${request.userId.username} has requested a break swap`,
        timestamp: request.createdAt,
      }));

      // Transform supervisor-approved requests into notification objects
      const supervisorNotifications = supervisorApprovedRequests.map(
        (request) => ({
          id: request._id,
          type: "SUPERVISOR_APPROVED",
          message: `Your ${request.type} request has been approved by ${request.approvedBy.username}`,
          breakId: request._id,
          approvedBy: request.approvedBy.username,
          breakType: request.type,
          createdAt: request.createdAt,
        })
      );
      // Combine and sort notifications by creation time
      const allNotifications = [
        ...swapNotifications,
        ...supervisorNotifications,
      ].sort((a, b) => b.createdAt - a.createdAt);

      return allNotifications;
    } catch (error) {
      logger.error(`Error fetching notifications for user ${userId}`, {
        error,
      });
      throw new Error("Failed to fetch notifications");
    }
  }
  // Supervisor approval
  static async approveBreakRequest(userId, breakId) {
    try {
      // Validate the approving user (must be a manager or supervisor)
      const approvingUser = await User.findById(userId);
      if (!approvingUser || approvingUser.role !== "MANAGER") {
        throw new Error("User is not authorized to approve break requests.");
      }

      // Find the break request
      const breakRequest = await BreakRequest.findById(breakId).populate(
        "userId",
        "username"
      );
      if (!breakRequest) {
        throw new Error(`Break request with ID ${breakId} not found.`);
      }
      if (breakRequest.status !== "PENDING") {
        throw new Error(
          `Break request ${breakId} is already ${breakRequest.status}.`
        );
      }

      // Approve the break request
      breakRequest.status = "APPROVED";
      breakRequest.approvedBy = userId;
      await breakRequest.save();

      // Log the successful approval
      logger.info(
        `Break request ${breakId} approved by user ${approvingUser.username}`
      );

      // Return a detailed success response
      return {
        message: "Break request approved successfully.",
        breakRequest,
        approvedBy: approvingUser.username,
        timestamp: new Date(),
      };
    } catch (error) {
      logger.error("Error approving break request", { error, userId, breakId });
      throw new Error("Failed to approve break request.");
    }
  }
}

export default BreakScheduleService;
