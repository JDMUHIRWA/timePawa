// In models/GeneratedBreak.js

import mongoose from "mongoose";

const generatedBreakSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  shift: {
    type: String,
    required: true,
  },
  slot: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: "PENDING",
  },
});

const GeneratedBreak = mongoose.model("GeneratedBreak", generatedBreakSchema);

export default GeneratedBreak;
