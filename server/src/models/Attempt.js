import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    studentName: { type: String, required: true },
    category: { type: String, required: true },
    score: { type: Number, required: true },
    submittedAnswers: [
      {
        questionTitle: String,
        userCodeOrAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean,
      },
    ],
    feedbackRating: { type: Number, default: 5 },
    feedbackComment: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Attempt", attemptSchema);