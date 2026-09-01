import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Assessments() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const modules = [
    { id: "dsa", title: "DSA & Problem Solving", icon: "💻", count: "150 Questions", time: "1h 30m", desc: "Arrays, Binary Trees, Dynamic Programming, Graphs" },
    { id: "aptitude", title: "Quantitative Aptitude", icon: "📊", count: "120 Questions", time: "1h 30m", desc: "Speed Math, Probability, Permutations, Series" },
    { id: "reasoning", title: "Logical Reasoning", icon: "🧩", count: "90 Questions", time: "1h 30m", desc: "Puzzles, Syllogisms, Direction Sense, Coding-Decoding" },
    { id: "communication", title: "Communication & Spoken Drills", icon: "🗣️", count: "80 Exercises", time: "1h 30m", desc: "Sentence Repetition, Corporate Grammar, Audio Prep" },
  ];

  const filtered = filter === "all" ? modules : modules.filter((m) => m.id === filter);

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", backgroundColor: colors.bg, padding: "36px 24px 80px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Header & Category Filters */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <span style={{ fontSize: "10px", fontWeight: "800", color: "#38BDF8", backgroundColor: "rgba(56, 189, 248, 0.12)", padding: "3px 8px", borderRadius: "6px" }}>
              ASSESSMENT VAULT
            </span>
            <h1 style={{ fontSize: "24px", fontWeight: "800", margin: "6px 0 2px", color: colors.textPrimary }}>
              Domain Assessment Catalog
            </h1>
            <p style={{ fontSize: "13px", color: colors.textSecondary, margin: 0 }}>
              Practice individual domains on-demand or enter the daily timed test.
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px", backgroundColor: colors.cardBg, padding: "4px", borderRadius: "12px", border: `1px solid ${colors.border}` }}>
            {["all", "dsa", "aptitude", "reasoning", "communication"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: filter === f ? "#0284C7" : "transparent",
                  color: filter === f ? "#fff" : colors.textSecondary,
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Assessment Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "18px" }}>
          {filtered.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.border}`,
                borderRadius: "20px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "28px" }}>{item.icon}</span>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#38BDF8", backgroundColor: "rgba(56, 189, 248, 0.1)", padding: "3px 8px", borderRadius: "6px" }}>
                  {item.time}
                </span>
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: "800", margin: 0, color: colors.textPrimary }}>
                {item.title}
              </h3>
              <p style={{ fontSize: "12px", color: colors.textSecondary, lineHeight: "1.5", margin: 0, flex: 1 }}>
                {item.desc}
              </p>
              <div style={{ fontSize: "11px", fontWeight: "700", color: colors.textSecondary }}>
                📦 {item.count}
              </div>
              <button
                onClick={() => navigate("/exam")}
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundColor: "#0284C7",
                  backgroundImage: "linear-gradient(135deg, #38BDF8, #0284C7)",
                  color: "#fff",
                  border: "none",
                  fontWeight: "700",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                Launch Assessment →
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}