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
    default: 45, // 45 minutes default
    min: 30,
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


// So then what if this is a call center and people also work 24hr/7days how will the time be divided? Let's take that they are 3 shifts where the first one starts from 8:00AM to 4:00PM, the next is 4PM to 12AM and the last one is 12AM to 8AM. Each shift is 8 hours. So how will this be divided? 
