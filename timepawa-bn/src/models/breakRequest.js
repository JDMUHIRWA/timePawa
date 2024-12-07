
import mongoose from "mongoose";

const BreakRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "MEETING",
        "COACHING",
        "TRAINING",
      ],
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

// Indexing for performance
BreakRequestSchema.index({ user: 1, startTime: 1 });
BreakRequestSchema.index({ status: 1 });

const BreakRequest = mongoose.model("BreakRequest", BreakRequestSchema);
export default BreakRequest;