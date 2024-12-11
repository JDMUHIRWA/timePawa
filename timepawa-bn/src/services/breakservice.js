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
}

export default BreakScheduleService;
