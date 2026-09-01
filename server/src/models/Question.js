import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, enum: ["dsa", "aptitude", "communication"], required: true },
    questionText: { type: String, required: true },
    // Section 1 (DSA)
    testCases: [
      {
        input: { type: String, default: "" },
        expectedOutput: { type: String, default: "" },
      },
    ],
    starterCode: { type: String, default: "# Write your solution here\n" },
    // Section 2 (Aptitude)
    options: [{ type: String }],
    correctAnswer: { type: String, default: "" },
    // Section 3 (Communication)
    audioUrl: { type: String, default: "" },
    dayIndex: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);