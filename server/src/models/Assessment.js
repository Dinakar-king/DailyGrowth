import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ["DSA", "Aptitude", "Reasoning", "Verbal", "Full-Mock"],
      default: "Full-Mock",
    },
    durationMinutes: { type: Number, default: 120 }, // 2 hours
    totalQuestions: { type: Number, default: 4 },
    totalMarks: { type: Number, default: 100 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["upcoming", "active", "completed", "expired"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Assessment", assessmentSchema);