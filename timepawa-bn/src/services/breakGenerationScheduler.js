import cron from "node-cron";
import BreakScheduleService from "../services/breakservice.js";
import logger from "../utils/logger.js"; // Assume a logging utility

class BreakGenerationScheduler {
  // Daily break generation at a specific time (e.g., early morning)
  static scheduleBreakGeneration() {
    // Generates breaks every week on SUNDAY 23:59 (11:59 PM)
    cron.schedule(
      "59 23 * * 0",
      async () => {
        try {
          logger.info("Starting weekly break generation process");

          const generatedBreaks =
            await BreakScheduleService.generateWeeklyBreaksForAllUsers();

          logger.info(
            `Successfully generated ${generatedBreaks.length} breaks`
          );
        } catch (error) {
          logger.error("Failed to generate weekly breaks:", error);
        }
      },
      {
        scheduled: true,
        timezone: "Africa/Nairobi", // East Africa Time
      }
    );
  }

  // Method to manually trigger break generation if needed
  static async manualBreakGeneration() {
    try {
      const generatedBreaks =
        await BreakScheduleService.generateWeeklyBreaksForAllUsers();
      return generatedBreaks;
    } catch (error) {
      logger.error("Manual break generation failed:", error);
      throw error;
    }
  }
}

export default BreakGenerationScheduler;
