import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      ref: "User",
      unique: true,
      index: true,
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
      enum: ["TEMPORARILY_INACTIVE", "SUSPENDED"],
      default: "ACTIVE",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for performance
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ department: 1 });
UserSchema.index({ team: 1 });

const User = mongoose.model("User", UserSchema);
export default User;
