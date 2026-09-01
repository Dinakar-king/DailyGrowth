// client/src/components/FeedbackModal.jsx
import React, { useState } from "react";

export default function FeedbackModal({ score, onSubmitFeedback }) {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitFeedback({ rating, feedback, finalScore: score });
  };

  return (
    <div style={fbStyles.overlay}>
      <div style={fbStyles.card}>
        <span style={{ fontSize: "40px" }}>🎉</span>
        <h2 style={{ color: "#fff", margin: "10px 0 4px" }}>Test Completed!</h2>
        <div style={fbStyles.scoreText}>Your Final Score: {score}/100</div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
          <label style={{ fontSize: "12px", color: "#94a3b8" }}>How was today's difficulty level?</label>
          <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer" }}
              >
                {star <= rating ? "⭐" : "☆"}
              </button>
            ))}
          </div>

          <textarea
            rows={3}
            placeholder="Give feedback on today's questions (optional)..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            style={fbStyles.textarea}
          />

          <button type="submit" style={fbStyles.submitBtn}>
            Submit Feedback & Return to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

const fbStyles = {
  overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  card: { backgroundColor: "#0d1527", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "30px", maxWidth: "420px", width: "90%", textAlign: "center" },
  scoreText: { fontSize: "20px", fontWeight: "800", color: "#38bdf8", margin: "6px 0 16px" },
  textarea: { backgroundColor: "#060A16", border: "1px solid #1e293b", borderRadius: "10px", color: "#fff", padding: "10px", fontSize: "12px", outline: "none" },
  submitBtn: { padding: "12px", borderRadius: "12px", backgroundColor: "#0284c7", color: "#fff", border: "none", fontWeight: "700", cursor: "pointer" },
};