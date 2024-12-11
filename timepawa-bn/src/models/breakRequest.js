import User from "../models/user.js";
import mongoose from "mongoose";

const BreakRequestSchema = new mongoose.Schema(
  {
    username: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    break_type: {
      type: String,
      enum: ["MEETING", "COACHING", "TRAINING"],
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "COMPLETED"],
      default: "PENDING",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
// Method to check break availability
breakRequestSchema.statics.checkBreakAvailability = async function (
  breakRequest
) {
  try {
    const existingBreaks = await BreakRequest.find({
      startTime: { $lte: breakRequest.startTime },
      endTime: { $gte: breakRequest.endTime },
    });

    // Check if any breaks overlap
    const hasConflict = existingBreaks.some((existingBreak) =>
      existingBreak.breaksOverlap(breakRequest)
    );

    if (hasConflict) {
      // Adjust the break or reject it based on your logic
      return {
        conflict: true,
        // Example: you can adjust timing here
        adjustedBreak: {
          ...breakRequest,
          startTime: moment(breakRequest.startTime).add(30, "minutes").toDate(),
        },
      };
    }

    return { conflict: false };
  } catch (error) {
    console.error("Error checking break availability:", error);
    return { conflict: false }; // No conflict if error occurs
  }
};
// Method to check if two breaks overlap
breakRequestSchema.statics.breaksOverlap = function (break1, break2) {
  return (
    break1.startTime >= break2.startTime && break1.startTime <= break2.endTime
  );
};
// Indexing for performance
BreakRequestSchema.index({ user: 1, startTime: 1 });
BreakRequestSchema.index({ status: 1 });

const BreakRequest = mongoose.model("BreakRequest", BreakRequestSchema);
export default BreakRequest;
