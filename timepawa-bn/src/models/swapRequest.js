import mongoose from "mongoose";

const SwapRequestSchema = new mongoose.Schema(
  {
    initiator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    target: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    breakType: {
      type: String,
      enum: ["SCREEN_BREAK_1", "LUNCH_BREAK", "SCREEN_BREAK_2"],
      required: true,
    },
    initiatorBreakDetails: {
      date: {
        type: Date,
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
    },
    targetBreakDetails: {
      date: {
        type: Date,
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
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
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

// Indexing for performance
SwapRequestSchema.index({ initiator: 1, target: 1 });
SwapRequestSchema.index({ status: 1 });
SwapRequestSchema.index({ breakType: 1 });

// Validation middleware
SwapRequestSchema.pre("save", function (next) {
  // Ensure break types are limited to specific breaks
  const validBreakTypes = ["SCREEN_BREAK_1", "SCREEN_BREAK_2", "LUNCH_BREAK"];

  if (!validBreakTypes.includes(this.breakType)) {
    return next(new Error("Invalid break type for swap"));
  }
  if (
    this.initiatorBreakDetails.startTime >= this.initiatorBreakDetails.endTime
  ) {
    return next(new Error("Invalid initiator break times"));
  }

  if (this.targetBreakDetails.startTime >= this.targetBreakDetails.endTime) {
    return next(new Error("Invalid target break times"));
  }

  next();
});

const SwapRequest = mongoose.model("SwapRequest", SwapRequestSchema);
export default SwapRequest;
