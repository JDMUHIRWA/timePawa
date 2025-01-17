import mongoose from "mongoose";
const StatusEnum = ["PENDING", "APPROVED", "REJECTED"];
const BreakTypeEnum = ["COACHING", "TRAINING", "MEETING"];

const ScheduleBreakSchema = new mongoose.Schema(
  {
    initiator: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: BreakTypeEnum,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: StatusEnum,
      default: "PENDING",
    },
    requestType: {
      type: String,
      default: "SCHEDULE_BREAK",
    },
    actionedAt: {
      type: Date,
    },
    actionedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for performance
ScheduleBreakSchema.index({ initiator: 1, status: 1 });

const ScheduleBreakRequest = mongoose.model(
  "ScheduleBreakRequest",
  ScheduleBreakSchema
);

export default ScheduleBreakRequest;
