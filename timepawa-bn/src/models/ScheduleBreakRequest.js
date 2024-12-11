import mongoose from "mongoose";

const SpecialBreakRequestSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      ref: "User",
      index: true,
    },
    break_type: {
      type: String,
      enum: ["COACHING", "MEETING", "TRAINING"],
      required: true,
    },
    requested_start_time: {
      type: Date,
      required: true,
    },
    requested_end_time: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      required: true,
    },
    supervisor_comment: {
      type: String,
      default: "",
    },
    request_date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for performance
SpecialBreakRequestSchema.index({ username: 1 });
SpecialBreakRequestSchema.index({ status: 1 });
SpecialBreakRequestSchema.index({ break_type: 1 });

const SpecialBreakRequest = mongoose.model(
  "SpecialBreakRequest",
  SpecialBreakRequestSchema
);
export default SpecialBreakRequest;

