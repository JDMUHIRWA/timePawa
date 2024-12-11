export default {
  breakGeneration: {
    cronSchedule: "0 5 * * *", // Daily at 5 AM
    timezone: "UTC",
    minTeamCoverage: 0.5,
  },
  breakDurations: {
    screenBreak: 15,
    lunchBreak: 30,
  },
};
