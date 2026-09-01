import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { fetchWithAuth } from "../api";

export default function ExamPortal() {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const videoRef = useRef(null);

  const [questions, setQuestions] = useState([]);
  const [category, setCategory] = useState("aptitude");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  const [timeLeft, setTimeLeft] = useState(5400);
  const [violations, setViolations] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showResultModal, setShowResultModal] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [savingFeedback, setSavingFeedback] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [audioBlobUrl, setAudioBlobUrl] = useState(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const data = await fetchWithAuth("/exam/today-questions");

        if (data.alreadyAttemptedToday) {
          alert("You have already completed today's assessment! Redirecting to Dashboard.");
          navigate("/");
          return;
        }

        setQuestions(data.questions || []);
        setCategory(data.category || "aptitude");
      } catch (err) {
        console.error("Failed to load questions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [navigate]);

  useEffect(() => {
    navigator.mediaDevices
      ?.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => {});

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitExam();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolations((prev) => {
          const next = prev + 1;
          alert(`⚠️ Tab Switch Detected! Violation ${next}/3.`);
          if (next >= 3) handleSubmitExam();
          return next;
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [questions, selectedAnswers]);

  const handleAnswerChange = (val) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questions[currentIndex]._id]: val,
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      const chunks = [];
      mr.ondataavailable = (e) => chunks.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        setAudioBlobUrl(URL.createObjectURL(blob));
        handleAnswerChange("Audio Voice Response Recorded");
      };
      mr.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access required for speech drill.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmitExam = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const stored = JSON.parse(localStorage.getItem("dg_user"));
    const formattedAnswers = questions.map((q) => ({
      questionId: q._id,
      userAnswer: selectedAnswers[q._id] || "",
    }));

    try {
      const result = await fetchWithAuth("/exam/submit", {
        method: "POST",
        body: JSON.stringify({
          category,
          answers: formattedAnswers,
        }),
      });

      if (result.user) {
        const updatedUser = { ...stored, streak: result.user.streak };
        localStorage.setItem("dg_user", JSON.stringify(updatedUser));
      }

      setScoreResult(result.score);
      setAttemptId(result.attemptId);
      setShowResultModal(true);
    } catch (err) {
      alert("Submission error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveFeedbackAndExit = async () => {
    setSavingFeedback(true);
    try {
      if (attemptId) {
        await fetchWithAuth("/exam/submit-feedback", {
          method: "POST",
          body: JSON.stringify({
            attemptId,
            feedbackRating,
            feedbackComment,
          }),
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingFeedback(false);
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "calc(100vh - 64px)", backgroundColor: colors.bg, color: colors.textPrimary, display: "flex", alignItems: "center", justifyContent: "center" }}>
        Loading assessment...
      </div>
    );
  }

  const currentQ = questions[currentIndex] || {};
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", backgroundColor: colors.bg, padding: "24px", color: colors.textPrimary }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: `1px solid ${colors.border}` }}>
          <div>
            <span style={{ fontSize: "10px", fontWeight: "800", color: "#38BDF8" }}>LIVE ASSESSMENT</span>
            <h2 style={{ fontSize: "20px", fontWeight: "800", margin: "4px 0 0", color: colors.textPrimary }}>
              {category.toUpperCase()} Round (Question {currentIndex + 1} of {questions.length})
            </h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: colors.cardBg, padding: "8px 16px", borderRadius: "12px", border: `1px solid ${colors.border}` }}>
            <span>⏱️ Time:</span>
            <strong style={{ color: "#38BDF8", fontFamily: "monospace" }}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </strong>
          </div>

          <button
            onClick={handleSubmitExam}
            disabled={isSubmitting}
            style={{ padding: "10px 22px", borderRadius: "10px", backgroundColor: "#10B981", color: "#fff", border: "none", fontWeight: "800", cursor: "pointer" }}
          >
            {isSubmitting ? "Submitting..." : "Submit Test"}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "20px" }}>
          <div style={{ backgroundColor: colors.cardBg, borderRadius: "20px", border: `1px solid ${colors.border}`, padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#38BDF8", margin: 0 }}>
                Question {currentIndex + 1}: {currentQ.title}
              </h3>
              <p style={{ fontSize: "14px", color: colors.textPrimary, lineHeight: "1.6", marginTop: "8px" }}>
                {currentQ.questionText}
              </p>
            </div>

            {category === "aptitude" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {currentQ.options?.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentQ._id] === opt;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleAnswerChange(opt)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "14px 18px",
                        borderRadius: "12px",
                        border: `1px solid ${isSelected ? "#38BDF8" : colors.border}`,
                        backgroundColor: isSelected ? "rgba(56, 189, 248, 0.12)" : colors.innerBg,
                        cursor: "pointer",
                      }}
                    >
                      <input type="radio" checked={isSelected} readOnly />
                      <span style={{ fontSize: "14px", color: colors.textPrimary }}>{opt}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {category === "dsa" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {currentQ.testCases?.length > 0 && (
                  <div style={{ padding: "12px", borderRadius: "10px", backgroundColor: colors.innerBg, border: `1px solid ${colors.border}`, fontSize: "12px" }}>
                    <strong>Sample Input:</strong> {currentQ.testCases[0].input} <br />
                    <strong>Expected Output:</strong> {currentQ.testCases[0].expectedOutput}
                  </div>
                )}
                <textarea
                  rows={10}
                  value={selectedAnswers[currentQ._id] || currentQ.starterCode || ""}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  style={{ width: "100%", backgroundColor: colors.innerBg, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "14px", color: "#38BDF8", fontFamily: "monospace", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                />
              </div>
            )}

            {category === "communication" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", backgroundColor: colors.innerBg, padding: "20px", borderRadius: "16px", border: `1px solid ${colors.border}` }}>
                {currentQ.audioUrl && (
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: colors.textSecondary, marginBottom: "6px" }}>🎧 Prompt Audio</label>
                    <audio controls src={currentQ.audioUrl} style={{ width: "100%" }} />
                  </div>
                )}
                <div>
                  {!isRecording ? (
                    <button type="button" onClick={startRecording} style={{ padding: "10px 20px", borderRadius: "10px", backgroundColor: "#EF4444", color: "#fff", border: "none", fontWeight: "700", cursor: "pointer" }}>
                      🔴 Start Recording Response
                    </button>
                  ) : (
                    <button type="button" onClick={stopRecording} style={{ padding: "10px 20px", borderRadius: "10px", backgroundColor: "#10B981", color: "#fff", border: "none", fontWeight: "700", cursor: "pointer" }}>
                      ⏹️ Stop & Save Clip
                    </button>
                  )}
                  {audioBlobUrl && <audio controls src={audioBlobUrl} style={{ width: "100%", marginTop: "10px" }} />}
                </div>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", borderTop: `1px solid ${colors.border}` }}>
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((p) => p - 1)}
                style={{ padding: "8px 16px", borderRadius: "10px", backgroundColor: colors.innerBg, border: `1px solid ${colors.border}`, color: colors.textPrimary, cursor: "pointer", opacity: currentIndex === 0 ? 0.4 : 1 }}
              >
                ← Previous
              </button>

              {isLastQuestion ? (
                <button
                  onClick={handleSubmitExam}
                  style={{ padding: "10px 20px", borderRadius: "10px", backgroundColor: "#0284C7", color: "#fff", border: "none", fontWeight: "800", cursor: "pointer" }}
                >
                  🚀 Submit All & Finish Test
                </button>
              ) : (
                <button
                  onClick={() => setCurrentIndex((p) => p + 1)}
                  style={{ padding: "8px 16px", borderRadius: "10px", backgroundColor: colors.innerBg, border: `1px solid ${colors.border}`, color: colors.textPrimary, cursor: "pointer" }}
                >
                  Next →
                </button>
              )}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ backgroundColor: colors.cardBg, borderRadius: "16px", border: `1px solid ${colors.border}`, padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "10px", fontWeight: "800", color: "#EF4444" }}>● PROCTOR ACTIVE</span>
              <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "160px", backgroundColor: "#000", borderRadius: "10px", objectFit: "cover" }} />
            </div>

            <div style={{ backgroundColor: colors.cardBg, borderRadius: "16px", border: `1px solid ${colors.border}`, padding: "14px" }}>
              <strong style={{ color: "#94A3B8", fontSize: "12px" }}>Violations: {violations} / 3</strong>
              <p style={{ margin: "4px 0 0", fontSize: "11px", color: colors.textSecondary }}>Do not exit full screen.</p>
            </div>
          </div>
        </div>

        {showResultModal && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
            <div style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: "22px", padding: "32px", maxWidth: "440px", width: "100%", textAlign: "center" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: colors.textPrimary, margin: "0 0 8px" }}>Assessment Completed! 🎉</h2>
              <div style={{ fontSize: "34px", fontWeight: "800", color: "#10B981", margin: "10px 0" }}>
                Score: {scoreResult}%
              </div>
              <p style={{ fontSize: "12px", color: colors.textSecondary, margin: "0 0 20px" }}>
                Your answers have been verified and submitted.
              </p>

              <div style={{ textAlign: "left", marginBottom: "20px", backgroundColor: colors.innerBg, padding: "16px", borderRadius: "14px", border: `1px solid ${colors.border}` }}>
                <label style={{ fontSize: "11px", fontWeight: "700", color: colors.textSecondary, textTransform: "uppercase" }}>
                  Candidate Feedback for Staff
                </label>
                <div style={{ display: "flex", gap: "8px", margin: "8px 0" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer", opacity: star <= feedbackRating ? 1 : 0.3 }}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Leave comments or difficulty feedback (e.g. Good questions!)..."
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  style={{ width: "100%", backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: "8px", padding: "10px", color: colors.textPrimary, fontSize: "12px", outline: "none", boxSizing: "border-box" }}
                  rows={2}
                />
              </div>

              <button
                onClick={handleSaveFeedbackAndExit}
                disabled={savingFeedback}
                style={{ width: "100%", padding: "12px", borderRadius: "12px", backgroundColor: "#0284C7", color: "#fff", border: "none", fontWeight: "800", cursor: "pointer" }}
              >
                {savingFeedback ? "Saving Feedback..." : "Save Feedback & Return to Dashboard →"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}