import moment from "moment";
import GeneratedBreak from "../models/generatedbreaks.js";
import User from "../models/user.js";

class BreakPatternAnalysisService {
  // Analyze individual user's break patterns
  static async analyzeUserBreakPatterns(userId, periodInDays = 30) {
    const startDate = moment().subtract(periodInDays, "days").toDate();

    const userBreaks = await GeneratedBreak.find({
      userId: userId,
      startTime: { $gte: startDate },
    }).sort({ startTime: 1 });

    return {
      totalBreaks: userBreaks.length,
      breakTypeDistribution: this.calculateBreakTypeDistribution(userBreaks),
      averageBreakDuration: this.calculateAverageBreakDuration(userBreaks),
      breakTimings: this.analyzeBreakTimings(userBreaks),
    };
  }

  // Calculate break type distribution
  static calculateBreakTypeDistribution(breaks) {
    return breaks.reduce((acc, breakItem) => {
      acc[breakItem.type] = (acc[breakItem.type] || 0) + 1;
      return acc;
    }, {});
  }

  // Calculate average break duration
  static calculateAverageBreakDuration(breaks) {
    if (breaks.length === 0) return 0;

    const totalDuration = breaks.reduce((sum, breakItem) => {
      return (
        sum + moment(breakItem.endTime).diff(breakItem.startTime, "minutes")
      );
    }, 0);

    return totalDuration / breaks.length;
  }

  // Analyze break timings
  static analyzeBreakTimings(breaks) {
    return breaks.map((breakItem) => ({
      type: breakItem.type,
      shift: breakItem.shift,
      startHour: moment(breakItem.startTime).hour(),
      duration: moment(breakItem.endTime).diff(breakItem.startTime, "minutes"),
    }));
  }

  // Team-wide break pattern analysis
  static async analyzeTeamBreakPatterns(periodInDays = 30) {
    const startDate = moment().subtract(periodInDays, "days").toDate();
    const agents = await User.find({ role: "AGENT" });

    const teamAnalysis = [];

    for (const agent of agents) {
      const userAnalysis = await this.analyzeUserBreakPatterns(
        agent._id,
        periodInDays
      );

      teamAnalysis.push({
        userId: agent._id,
        username: agent.username,
        ...userAnalysis,
      });
    }

    return {
      teamBreakAnalysis: teamAnalysis,
      overallTeamStats: this.calculateOverallTeamStats(teamAnalysis),
    };
  }

  // Calculate overall team break statistics
  static calculateOverallTeamStats(teamAnalysis) {
    return {
      averageBreakDuration: this.calculateAverageFromArray(
        teamAnalysis.map((analysis) => analysis.averageBreakDuration)
      ),
      breakTypeDistribution: teamAnalysis.reduce((acc, analysis) => {
        Object.entries(analysis.breakTypeDistribution).forEach(
          ([type, count]) => {
            acc[type] = (acc[type] || 0) + count;
          }
        );
        return acc;
      }, {}),
    };
  }

  // Utility method to calculate average
  static calculateAverageFromArray(arr) {
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
  }
}

export default BreakPatternAnalysisService;
