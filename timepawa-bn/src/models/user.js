import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["AGENT", "SUPERVISOR"],
      default: "AGENT",
      required: true,
    },
    isMfaActive: {
      type: Boolean,
      required: false,
    },
    twoFactorSecret: {
      type: String,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BreakAllowanceSchema = new mongoose.Schema({
  screenBreak1Duration: {
    type: Number,
    default: 15, // 15 minutes default
    min: 0,
    max: 60,
  },
  lunchBreakDuration: {
    type: Number,
    default: 30, // 30 minutes default
    min: 0,
    max: 90,
  },
  screenBreak2Duration: {
    type: Number,
    default: 15, // 15 minutes default
    min: 0,
    max: 60,
  },
  weeklyBreakLimit: {
    type: Number,
    default: 300, // 5 hours total break time
    min: 0,
  },
});

// Indexing for performance
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ department: 1 });
UserSchema.index({ team: 1 });

const User = mongoose.model("User", UserSchema);
export default User;
