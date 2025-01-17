import mongoose from "mongoose";

const StatusEnum = ["PENDING", "APPROVED", "REJECTED"];

const SwapRequestSchema = new mongoose.Schema(
  {
    initiator: {
      type: String,
      required: true,
      index: true,
    },
    target: {
      type: String,
      required: true,
      index: true,
    },
    from: {
      type: Date,
      required: true,
    },
    to: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: StatusEnum,
      default: "PENDING",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reason: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    requestType: {
      type: String,
      default: "SWAP",
    },
    actionedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
SwapRequestSchema.index({ initiator: 1, status: 1 });
SwapRequestSchema.index({ target: 1, status: 1 });

const SwapRequest = mongoose.model("SwapRequest", SwapRequestSchema);
export default SwapRequest;
