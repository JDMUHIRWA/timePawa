import mongoose from "mongoose";

const MonthlyBreaksSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: true,
      ref: "User", // Reference to the User model
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12, // Month must be between 1 (January) and 12 (December)
    },
    year: {
      type: Number,
      required: true,
    },
    total_screen_breaks_1: {
      type: Number,
      default: 0, // Defaults to 0 if no screen breaks were taken
      min: 0,
    },
    total_screen_breaks_2: {
      type: Number,
      default: 0, // Defaults to 0 if no screen breaks were taken
      min: 0,
    },
    total_lunch_breaks: {
      type: Number,
      default: 0, // Defaults to 0 if no lunch breaks were taken
      min: 0,
    },
    total_break_duration: {
      type: Number,
      default: 0, // Defaults to 0 if no breaks were taken
      min: 0, // Duration in minutes
    },
    status: {
      type: String,
      enum: ["COMPLETED"], // Breaks status for the month
      default: "COMPLETED",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Indexing for faster queries
MonthlyBreaksSchema.index({ user_id: 1, month: 1, year: 1 }); // Unique per user, month, and year

const MonthlyBreaks = mongoose.model("MonthlyBreaks", MonthlyBreaksSchema);

export default MonthlyBreaks;
