import moment from "moment";

class BreakRandomizationService {
  // Weighted randomization based on user's historical break patterns
  static generateWeightedRandomBreakTime(
    startTime,
    endTime,
    userBreakHistory = [],
    complexityFactor = 0.7
  ) {
    const startMoment = moment(startTime);
    const endMoment = moment(endTime);
    const totalMinutes = endMoment.diff(startMoment, "minutes");

    // Analyze historical break preferences
    const preferredTimeSlots = this.analyzePreferredTimeSlots(userBreakHistory);

    // Generate base random time
    const baseRandomMinutes = Math.random() * totalMinutes;

    // Apply weighted randomization
    const weightedRandomTime = this.applyTimePreferenceWeighting(
      baseRandomMinutes,
      preferredTimeSlots,
      complexityFactor
    );

    return startMoment.clone().add(weightedRandomTime, "minutes").toDate();
  }

  // Analyze user's preferred break times from history
  static analyzePreferredTimeSlots(breakHistory) {
    if (breakHistory.length === 0) {
      return {}; // No historical preference
    }

    const timeSlotPreferences = {};
    breakHistory.forEach((breakItem) => {
      const hourOfDay = moment(breakItem.startTime).hour();
      const timeSlot = this.categorizeTimeSlot(hourOfDay);

      timeSlotPreferences[timeSlot] = (timeSlotPreferences[timeSlot] || 0) + 1;
    });

    return timeSlotPreferences;
  }

  // Categorize time into slots
  static categorizeTimeSlot(hour) {
    if (hour >= 6 && hour < 10) return "EARLY_MORNING";
    if (hour >= 10 && hour < 12) return "LATE_MORNING";
    if (hour >= 12 && hour < 14) return "MIDDAY";
    if (hour >= 14 && hour < 17) return "AFTERNOON";
    if (hour >= 17 && hour < 20) return "EARLY_EVENING";
    if (hour >= 20 && hour < 22) return "LATE_EVENING";
    return "NIGHT";
  }

  // Apply time preference weighting
  static applyTimePreferenceWeighting(
    baseRandomTime,
    preferredTimeSlots,
    complexityFactor
  ) {
    const totalPreferences = Object.values(preferredTimeSlots).reduce(
      (sum, count) => sum + count,
      0
    );

    // If no clear preference, return base random time
    if (totalPreferences === 0) return baseRandomTime;

    // Calculate weighted adjustment
    const weightAdjustment = Object.entries(preferredTimeSlots).reduce(
      (adjustment, [slot, count]) => {
        const slotWeight = count / totalPreferences;
        return adjustment + slotWeight * complexityFactor;
      },
      0
    );

    return baseRandomTime * (1 + weightAdjustment);
  }
}

export default BreakRandomizationService;
