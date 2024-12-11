import mongoose from "mongoose";

const DailyBreaksSchema = new mongoose.Schema(
    {   
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            indexe: true,
        },
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
        start_time: {
            type: Date,
            required: true,
        },
        end_time: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["PENDING", "ONGOING", "COMPLETED"],
            default: "PENDING",
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

// Indexing for performance
DailyBreaksSchema.index({ username: 1 });
DailyBreaksSchema.index({ break_type: 1 });
DailyBreaksSchema.index({ status: 1 });

const DailyBreaks = mongoose.model("DailyBreaks", DailyBreaksSchema);
export default DailyBreaks;