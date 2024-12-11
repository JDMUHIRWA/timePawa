import mongoose from "mongoose";

const WeeklyBreakSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    ref: "User",
    unique: true,
  },
  break_type: {
    type: String,
    enum: ["SCREEN_BREAK_1", "LUNCH", "SCREEN_BREAK_2"],
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "ONGOING", "COMPLETED"],
    default: "PENDING",
    required: true,
  },
  week_start_date: {
    type: Date,
    required: true,
  },
  week_end_date: {
    type: Date,
    required: true,
  },
  total_break_duration: {
    type: Number,
    required: true,
  },
}, {
  
    timestamps: true,
  },
);

// Indexing for performance
WeeklyBreakSchema.index({ username: 1 });
WeeklyBreakSchema.index({ break_type: 1 });
WeeklyBreakSchema.index({ status: 1 });

const WeeklyBreak = mongoose.model("WeeklyBreak", WeeklyBreakSchema);