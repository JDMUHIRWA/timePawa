import mongoose from "mongoose";

const morningBreaksSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true,
  },
  user_id: {
    type: String,
    required: true,
    index: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["PENDING", "ONGOING", "COMPLETED"],
  },
  break_type: {
    type: String,
    required: true,
    enum: ["SCREEN_BREAK_1", "LUNCH", "SCREEN_BREAK_2"],
  },
  break_duration: {
    type: Number,
    required: true,
  },
  time_period: {
    type: String,
    required: true,
    enum: ["MORNING"],
  },
});

const MorningBreaks = mongoose.model("MorningBreaks", morningBreaksSchema);

export default MorningBreaks;
