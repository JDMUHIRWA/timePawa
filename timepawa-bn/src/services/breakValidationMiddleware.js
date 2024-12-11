import moment from "moment";
import GeneratedBreak from "../models/generatedbreaks.js";

class BreakValidationMiddleware {
  // Check for break time overlaps for a specific user
  static async checkBreakOverlaps(userId, newBreak) {
    try {
      // Find existing breaks for the user that might overlap
      const existingBreaks = await GeneratedBreak.find({
        userId: userId,
        status: { $ne: "CANCELLED" },
        $or: [
          // Check if new break start time is within existing break
          {
            startTime: { $lt: newBreak.endTime },
            endTime: { $gt: newBreak.startTime },
          },
          // Check if new break completely encompasses an existing break
          {
            startTime: { $gte: newBreak.startTime },
            endTime: { $lte: newBreak.endTime },
          },
        ],
      });

      return existingBreaks.length > 0;
    } catch (error) {
      console.error("Error checking break overlaps:", error);
      throw error;
    }
  }

  // Middleware to validate break generation
  static async validateBreakGeneration(breaks) {
    const validationResults = [];

    for (const breakItem of breaks) {
      const hasOverlap = await this.checkBreakOverlaps(
        breakItem.userId,
        breakItem
      );

      validationResults.push({
        break: breakItem,
        isValid: !hasOverlap,
        overlapError: hasOverlap
          ? "Break time conflicts with existing breaks"
          : null,
      });
    }

    return validationResults;
  }

  // Team coverage validation
  static async validateTeamCoverage(breaks) {
    // Implement logic to ensure minimum team members are always available
    const breaksByShift = breaks.reduce((acc, breakItem) => {
      if (!acc[breakItem.shift]) {
        acc[breakItem.shift] = 0;
      }
      acc[breakItem.shift]++;
      return acc;
    }, {});

    // Example: Ensure at least 50% of team is not on break simultaneously
    const minimumCoverageRatio = 0.5;
    const totalBreaks = breaks.length;

    return Object.entries(breaksByShift).map(([shift, count]) => ({
      shift,
      breakCount: count,
      coverageRatio: count / totalBreaks,
      isValidCoverage: count / totalBreaks <= minimumCoverageRatio,
    }));
  }
}

export default BreakValidationMiddleware;
