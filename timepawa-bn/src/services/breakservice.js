import moment from "moment";
import User from "../models/user.js";
import GeneratedBreak from "../models/generatedbreaks.js";

class BreakScheduleService {
  // Method to generate dynamic weekly breaks
  static async generateDynamicWeeklyBreaks(user) {
    const shiftBreakTemplates = {
      MORNING_SHIFT: [
        { slot: "EARLY_MORNING", timeRange: ["08:30", "10:30"] },
        { slot: "MIDDAY", timeRange: ["11:30", "13:30"] },
        { slot: "LATE_AFTERNOON", timeRange: ["14:30", "16:30"] },
      ],
      EVENING_SHIFT: [
        { slot: "EARLY_EVENING", timeRange: ["16:30", "18:30"] },
        { slot: "LATE_EVENING", timeRange: ["19:30", "21:30"] },
        { slot: "NIGHT", timeRange: ["22:30", "00:30"] },
      ],
      NIGHT_SHIFT: [
        { slot: "EARLY_NIGHT", timeRange: ["00:30", "02:30"] },
        { slot: "MIDNIGHT", timeRange: ["03:00", "05:00"] },
        { slot: "EARLY_MORNING", timeRange: ["06:00", "07:30"] },
      ],
    };

    const userShift = this.determineUserShift(user);
    const breakTypes = ["SCREEN_BREAK_1", "LUNCH_BREAK", "SCREEN_BREAK_2"];

    return breakTypes.map((breakType, index) => {
      const breakTemplates = shiftBreakTemplates[userShift];
      if (!breakTemplates) {
        throw new Error(`No break templates found for shift: ${userShift}`);
      }

      const selectedTemplate = breakTemplates[index];
      const [startTimeStr, endTimeStr] = selectedTemplate.timeRange;
      const [startHour, startMinute] = startTimeStr.split(":").map(Number);
      const [endHour, endMinute] = endTimeStr.split(":").map(Number);

      const randomMinutes = Math.floor(
        Math.random() *
          (endHour * 60 + endMinute - (startHour * 60 + startMinute))
      );

      const breakStartTime = moment()
        .set("hour", startHour)
        .set("minute", startMinute)
        .add(randomMinutes, "minutes");

      const breakDuration = this.getBreakDuration(user, breakType);

      return {
        type: breakType,
        shift: userShift,
        slot: selectedTemplate.slot,
        startTime: breakStartTime.toDate(),
        endTime: breakStartTime.clone().add(breakDuration, "minutes").toDate(),
        status: "PENDING",
        userId: user._id, // Include user ID for saving
        username: user.username, // Include username for saving
      };
    });
  }

  // Determine user's shift
  static determineUserShift(user) {
    const currentTime = moment();
    const hourOfDay = currentTime.hour();

    if (hourOfDay >= 8 && hourOfDay < 16) {
      return "MORNING_SHIFT";
    } else if (hourOfDay >= 16 && hourOfDay < 0) {
      return "EVENING_SHIFT";
    } else {
      return "NIGHT_SHIFT";
    }
  }

  // Get break duration based on break type
  static getBreakDuration(user, breakType) {
    const breakAllowance = user.breakAllowance || {};
    switch (breakType) {
      case "SCREEN_BREAK_1":
        return breakAllowance.screenBreak1Duration || 15;
      case "LUNCH_BREAK":
        return breakAllowance.lunchBreakDuration || 30;
      case "SCREEN_BREAK_2":
        return breakAllowance.screenBreak2Duration || 15;
      default:
        return 15;
    }
  }

  // Save generated breaks
  static async saveGeneratedBreaks(user, breaks) {
    try {
      const savedBreaks = await GeneratedBreak.insertMany(
        breaks.map((breakItem) => ({
          ...breakItem,
          userId: user._id,
          username: user.username,
        }))
      );

      return savedBreaks;
    } catch (error) {
      console.error("Error saving generated breaks:", error);
      throw error;
    }
  }

  // Generate breaks for all users
  static async generateWeeklyBreaksForAllUsers() {
    try {
      // Fetch all active agents
      const agents = await User.find({
        role: "AGENT",
      });

      const allBreaks = [];
      for (const agent of agents) {
        const generatedBreaks = await this.generateDynamicWeeklyBreaks(agent); // Add `await` here
        const savedBreaks = await this.saveGeneratedBreaks(
          agent,
          generatedBreaks
        );
        allBreaks.push(...savedBreaks);
      }

      return allBreaks;
    } catch (error) {
      console.error("Error generating weekly breaks:", error);
      throw error;
    }
  }
}

export default BreakScheduleService;
