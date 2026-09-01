import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Question from "../models/Question.js";
import Attempt from "../models/Attempt.js";
import { auth, adminOnly } from "../middleware/auth.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads", "audio");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Batch Question Publisher (Supports multiple MCQs, Coding, SQL, and Audio)
router.post(
  "/create-batch-questions",
  auth,
  adminOnly,
  upload.array("audioFiles", 10),
  async (req, res) => {
    try {
      const { category, questionsData, sqlChallenge } = req.body;
      const parsedQuestions = typeof questionsData === "string" ? JSON.parse(questionsData) : questionsData;

      const count = await Question.countDocuments({ category });
      const records = [];

      // Process Audio files map if applicable
      const files = req.files || [];

      parsedQuestions.forEach((q, idx) => {
        let audioUrl = q.audioUrl || "";
        if (files[idx]) {
          audioUrl = `http://localhost:5000/uploads/audio/${files[idx].filename}`;
        }

        records.push({
          title: q.title || `${category.toUpperCase()} Question ${count + idx + 1}`,
          category,
          questionText: q.questionText,
          starterCode: q.starterCode || "",
          testCases: q.testCases || [],
          options: q.options || [],
          correctAnswer: q.correctAnswer || "",
          audioUrl,
          dayIndex: count + idx + 1,
        });
      });

      // If a daily SQL question was attached, publish it into rotation
      if (sqlChallenge) {
        const parsedSql = typeof sqlChallenge === "string" ? JSON.parse(sqlChallenge) : sqlChallenge;
        if (parsedSql && parsedSql.questionText) {
          records.push({
            title: parsedSql.title || "Daily SQL Query Challenge",
            category: "sql",
            questionText: parsedSql.questionText,
            starterCode: parsedSql.starterCode || "SELECT * FROM table_name;",
            testCases: parsedSql.expectedOutput ? [{ input: "Run Query", expectedOutput: parsedSql.expectedOutput }] : [],
            options: [],
            correctAnswer: parsedSql.expectedOutput || "",
            dayIndex: count + records.length + 1,
          });
        }
      }

      await Question.insertMany(records);

      res.status(201).json({
        success: true,
        message: `Successfully published ${records.length} assessment question(s) to live student portal!`,
      });
    } catch (error) {
      console.error("Batch publish error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

router.get("/student-submissions", auth, adminOnly, async (req, res) => {
  try {
    const submissions = await Attempt.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/student-feedbacks", auth, adminOnly, async (req, res) => {
  try {
    const feedbacks = await Attempt.find({ feedbackComment: { $ne: "" } })
      .select("studentName feedbackRating feedbackComment category createdAt")
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;