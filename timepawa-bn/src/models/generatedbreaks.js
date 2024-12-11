import mongoose from "mongoose";

const generatedBreakSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    username: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },
    break_type: {
      type: String,
      enum: ["SCREEN_BREAK_1", "LUNCH_BREAK", "SCREEN_BREAK_2"],
      required: true,
    },
    shift: {
      type: String,
      enum: ["MORNING_SHIFT", "EVENING_SHIFT", "NIGHT_SHIFT"],
      required: true,
    },
    slot: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
      index: true,
    },
    endTime: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "CANCELLED", "SWAP_REQUESTED", "SUPERVISOR_APPROVED"],
      default: "PENDING",
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reason: {
      type: String,
      trim: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add a compound index for efficient querying
generatedBreakSchema.index({ userId: 1, startTime: 1 });

const GeneratedBreak = mongoose.model("GeneratedBreak", generatedBreakSchema);

export default GeneratedBreak;