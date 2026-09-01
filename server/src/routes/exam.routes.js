import express from "express";
import Question from "../models/Question.js";
import Attempt from "../models/Attempt.js";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Helper to check if a date is today
const isSameDay = (d1, d2) => {
  if (!d1 || !d2) return false;
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Helper to check if date was yesterday
const isYesterday = (d1) => {
  if (!d1) return false;
  const date = new Date(d1);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
};

// 1. Get Questions + Check Daily Attempt Status
router.get("/today-questions", auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if user already took a test today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const existingTodayAttempt = await Attempt.findOne({
      userId,
      createdAt: { $gte: startOfToday },
    });

    const rotationCategories = ["dsa", "aptitude", "communication"];
    const dayIndex = new Date().getDate() % 3;
    const currentCategory = req.query.category || rotationCategories[dayIndex];

    let questions = await Question.find({ category: currentCategory }).limit(10);

    if (!questions || questions.length === 0) {
      questions = [
        {
          _id: "mock_1",
          title: "Logical Reasoning Sequence",
          category: currentCategory,
          questionText: "In a certain code language, if 'COMPUTER' is written as 'RFUVQNPC', how will 'MEDICINE' be written?",
          options: ["MFEDJJOE", "EOJDEJFM", "MFEJDJEF", "EOJDJEFM"],
          correctAnswer: "EOJDJEFM",
        },
      ];
    }

    res.json({
      category: currentCategory,
      totalQuestions: questions.length,
      questions,
      alreadyAttemptedToday: !!existingTodayAttempt,
      todayScore: existingTodayAttempt ? existingTodayAttempt.score : null,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch exam questions", error: error.message });
  }
});

// 2. Submit Exam & Update Daily Streak
router.post("/submit", auth, async (req, res) => {
  try {
    const { category, answers } = req.body;
    const userId = req.user._id;
    const studentName = req.user.name;

    // Strict Check: Only 1 attempt per day allowed
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const existingTodayAttempt = await Attempt.findOne({
      userId,
      createdAt: { $gte: startOfToday },
    });

    if (existingTodayAttempt) {
      return res.status(400).json({
        message: "You have already completed today's assessment. Come back tomorrow!",
        alreadyAttempted: true,
        score: existingTodayAttempt.score,
      });
    }

    // Auto-grade answers
    const questionIds = (answers || []).map((a) => a.questionId);
    const originalQuestions = await Question.find({ _id: { $in: questionIds } });
    const qMap = new Map(originalQuestions.map((q) => [q._id.toString(), q]));

    let correctCount = 0;
    const submittedAnswers = (answers || []).map((ans) => {
      const original = qMap.get(ans.questionId);
      const isCorrect = original ? original.correctAnswer === ans.userAnswer : false;
      if (isCorrect) correctCount++;
      return {
        questionTitle: original?.title || "Question",
        userCodeOrAnswer: ans.userAnswer,
        correctAnswer: original?.correctAnswer || "N/A",
        isCorrect,
      };
    });

    const totalQ = answers.length || 1;
    const calculatedScore = Math.round((correctCount / totalQ) * 100);

    // Save Attempt
    const attempt = await Attempt.create({
      userId,
      studentName,
      category: category || "aptitude",
      score: calculatedScore,
      submittedAnswers,
      feedbackRating: 5,
      feedbackComment: "",
    });

    // Calculate New Streak
    const user = await User.findById(userId);
    let newStreak = 1;

    if (user.lastActive) {
      if (isYesterday(user.lastActive)) {
        newStreak = (user.streak || 0) + 1;
      } else if (isSameDay(user.lastActive, new Date())) {
        newStreak = user.streak || 1;
      } else {
        newStreak = 1; // streak broke, reset to 1
      }
    }

    user.streak = newStreak;
    user.lastActive = new Date();
    await user.save();

    res.json({
      success: true,
      message: "Assessment submitted successfully!",
      score: calculatedScore,
      attemptId: attempt._id,
      streak: user.streak,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        streak: user.streak,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Submission failed", error: error.message });
  }
});

// 3. Save Candidate Feedback
router.post("/submit-feedback", auth, async (req, res) => {
  try {
    const { attemptId, feedbackRating, feedbackComment } = req.body;
    if (attemptId) {
      await Attempt.findByIdAndUpdate(attemptId, {
        feedbackRating: Number(feedbackRating) || 5,
        feedbackComment: feedbackComment || "Good practice test",
      });
    }
    res.json({ success: true, message: "Feedback saved!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. Student Profile Stats
router.get("/profile-stats", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const attempts = await Attempt.find({ userId }).sort({ createdAt: -1 });

    const totalSessions = attempts.length;
    const avgAccuracy =
      totalSessions > 0
        ? Math.round(attempts.reduce((acc, c) => acc + (c.score || 0), 0) / totalSessions)
        : 0;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const existingToday = await Attempt.findOne({
      userId,
      createdAt: { $gte: startOfToday },
    });

    const user = await User.findById(userId).select("-password");

    res.json({
      user,
      totalSessions,
      avgAccuracy,
      attempts,
      alreadyAttemptedToday: !!existingToday,
      todayScore: existingToday ? existingToday.score : null,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats", error: error.message });
  }
});

export default router;