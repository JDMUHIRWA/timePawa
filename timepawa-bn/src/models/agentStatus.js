import mongoose from "mongoose";

const AgentsStatusSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      ref: "User",
    },
    break_type: {
      type: String,
      enum: ["SCREEN_BREAK_1", "LUNCH", "SCREEN_BREAK_2"],
      required: true,
    },
    status: {
      type: String,
      enum: ["ONGOING", "PENDING", "COMPLETED"],
      default: "PENDING",
      required: true,
    },
    current_time: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for performance
AgentsStatusSchema.index({ username: 1 });
AgentsStatusSchema.index({ status: 1 });
AgentsStatusSchema.index({ break_type: 1 });

const AgentsStatus = mongoose.model("AgentsStatus", AgentsStatusSchema);
export default AgentsStatus;

