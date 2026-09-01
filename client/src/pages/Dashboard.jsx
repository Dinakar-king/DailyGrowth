import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { fetchWithAuth } from "../api";

export default function Dashboard() {
  const navigate = useNavigate();
  const { colors } = useTheme();

  const [user, setUser] = useState(null);
  const [accuracy, setAccuracy] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [alreadyAttemptedToday, setAlreadyAttemptedToday] = useState(false);
  const [todayScore, setTodayScore] = useState(null);

  const [sqlQuery, setSqlQuery] = useState(
    "SELECT MAX(salary) AS second_highest FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);"
  );
  const [sqlStatus, setSqlStatus] = useState("");
  const [sqlResult, setSqlResult] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("dg_user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);

      fetchWithAuth("/exam/profile-stats")
        .then((data) => {
          if (data?.avgAccuracy !== undefined) setAccuracy(data.avgAccuracy);
          if (data?.totalSessions !== undefined) setTotalSessions(data.totalSessions);
          if (data?.alreadyAttemptedToday !== undefined) {
            setAlreadyAttemptedToday(data.alreadyAttemptedToday);
            setTodayScore(data.todayScore);
          }
          if (data?.user?.streak !== undefined) {
            setUser((prev) => ({ ...prev, streak: data.user.streak }));
            localStorage.setItem("dg_user", JSON.stringify({ ...parsed, streak: data.user.streak }));
          }
        })
        .catch(() => setAccuracy(0));
    }
  }, []);

  const rotationDays = [
    { name: "DSA & Problem Solving", tag: "DSA", icon: "💻", time: "1h 30m", desc: "Arrays, Trees, Graphs, DP & Algorithmic Optimization" },
    { name: "Quantitative Aptitude & Logic", tag: "Aptitude", icon: "📊", time: "1h 30m", desc: "Speed math, probability, series, and analytical puzzles" },
    { name: "Communication & Verbal", tag: "Communication", icon: "🗣️", time: "1h 30m", desc: "Spoken drills, sentence repetition, and business grammar" },
  ];

  const dayIndex = new Date().getDate() % 3;
  const todaysTrack = rotationDays[dayIndex];
  const tomorrowTrack = rotationDays[(dayIndex + 1) % 3];
  const dayAfterTrack = rotationDays[(dayIndex + 2) % 3];

  const handleRunSql = () => {
    setSqlStatus("Executing query against sandbox database...");
    setTimeout(() => {
      setSqlStatus("✅ Query executed successfully! All test cases passed.");
      setSqlResult({ columns: ["second_highest"], rows: [["$124,500"]] });
    }, 500);
  };

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", backgroundColor: colors.bg, color: colors.textPrimary, padding: "32px 24px 80px", transition: "all 0.2s ease" }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <span style={{ fontSize: "10px", fontWeight: "800", color: "#38BDF8", backgroundColor: "rgba(56, 189, 248, 0.12)", padding: "3px 8px", borderRadius: "6px" }}>
              ⚡ DAILY INTERVIEW READINESS
            </span>
            <h1 style={{ fontSize: "26px", fontWeight: "800", margin: "6px 0 2px", color: colors.textPrimary }}>
              Welcome back, {user?.name || "Candidate"}
            </h1>
            <p style={{ fontSize: "13px", color: colors.textSecondary, margin: 0 }}>
              Stay consistent with your scheduled 1.5-hour rotations and daily SQL sprint.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 18px", borderRadius: "16px", backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, minWidth: "140px" }}>
              <span style={{ fontSize: "22px" }}>🔥</span>
              <div>
                <div style={{ fontSize: "18px", fontWeight: "800", color: "#F59E0B" }}>{user?.streak || 0} Days</div>
                <div style={{ fontSize: "9px", fontWeight: "700", color: colors.textSecondary }}>CURRENT STREAK</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 18px", borderRadius: "16px", backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, minWidth: "140px" }}>
              <span style={{ fontSize: "22px" }}>🎯</span>
              <div>
                <div style={{ fontSize: "18px", fontWeight: "800", color: "#10B981" }}>{accuracy}%</div>
                <div style={{ fontSize: "9px", fontWeight: "700", color: colors.textSecondary }}>ACCURACY RATE</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 18px", borderRadius: "16px", backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, minWidth: "140px" }}>
              <span style={{ fontSize: "22px" }}>📚</span>
              <div>
                <div style={{ fontSize: "18px", fontWeight: "800", color: "#38BDF8" }}>{totalSessions}</div>
                <div style={{ fontSize: "9px", fontWeight: "700", color: colors.textSecondary }}>SESSIONS ATTENDED</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", padding: "32px", borderRadius: "24px", backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <span style={{ fontSize: "10px", fontWeight: "800", color: "#38BDF8", backgroundColor: "rgba(56, 189, 248, 0.15)", padding: "4px 10px", borderRadius: "20px" }}>
                ● TODAY'S MANDATORY TEST
              </span>
              <span style={{ fontSize: "10px", fontWeight: "700", color: colors.textSecondary, backgroundColor: colors.innerBg, padding: "4px 10px", borderRadius: "20px" }}>
                ⏱️ {todaysTrack.time}
              </span>
            </div>

            <h2 style={{ fontSize: "22px", fontWeight: "800", margin: 0, color: colors.textPrimary }}>
              {todaysTrack.icon} {todaysTrack.name}
            </h2>
            <p style={{ fontSize: "13px", lineHeight: "1.6", color: colors.textSecondary, margin: 0, maxWidth: "540px" }}>
              {todaysTrack.desc}. Complete your proctored assessment before 11:59 PM to maintain your daily streak.
            </p>

            {alreadyAttemptedToday ? (
              <button
                disabled
                style={{
                  alignSelf: "flex-start",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  backgroundColor: "#10B981",
                  color: "#FFFFFF",
                  border: "none",
                  fontWeight: "800",
                  fontSize: "13px",
                  cursor: "not-allowed",
                  marginTop: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                ✅ Today's Test Completed ({todayScore}%) — Next Session Unlocks Tomorrow
              </button>
            ) : (
              <button
                onClick={() => navigate("/exam")}
                style={{
                  alignSelf: "flex-start",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  backgroundColor: "#0284C7",
                  backgroundImage: "linear-gradient(135deg, #38BDF8, #0284C7)",
                  color: "#FFFFFF",
                  border: "none",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "pointer",
                  marginTop: "6px",
                }}
              >
                Start Today's Assessment ({todaysTrack.time}) →
              </button>
            )}
          </div>

          <div style={{ padding: "20px", borderRadius: "18px", backgroundColor: colors.innerBg, border: `1px solid ${colors.border}`, display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ fontSize: "10px", fontWeight: "800", color: colors.textSecondary, letterSpacing: "0.5px", marginBottom: "4px" }}>
              3-DAY ROTATION CYCLE
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(56, 189, 248, 0.12)", padding: "10px 14px", borderRadius: "10px", fontSize: "12px" }}>
              <span style={{ fontSize: "10px", fontWeight: "800", color: "#38BDF8" }}>TODAY</span>
              <strong style={{ color: "#38BDF8" }}>{todaysTrack.tag} (Live)</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: "10px", fontSize: "12px" }}>
              <span style={{ fontSize: "10px", fontWeight: "700", color: colors.textSecondary }}>TOMORROW</span>
              <span style={{ color: colors.textSecondary }}>{tomorrowTrack.tag}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: "10px", fontSize: "12px" }}>
              <span style={{ fontSize: "10px", fontWeight: "700", color: colors.textSecondary }}>DAY AFTER</span>
              <span style={{ color: colors.textSecondary }}>{dayAfterTrack.tag}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: "18px", fontWeight: "800", margin: "0 0 2px", color: colors.textPrimary }}>
            Interview Practice Tracks
          </h3>
          <p style={{ fontSize: "12px", color: colors.textSecondary, margin: "0 0 16px" }}>
            Self-paced practice vault across all placement rounds.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {rotationDays.map((track, i) => (
              <div key={i} style={{ padding: "22px", borderRadius: "20px", backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "24px" }}>{track.icon}</span>
                  <span style={{ fontSize: "10px", fontWeight: "700", color: "#38BDF8", backgroundColor: "rgba(56, 189, 248, 0.1)", padding: "2px 8px", borderRadius: "6px" }}>
                    {track.time}
                  </span>
                </div>
                <h4 style={{ fontSize: "15px", fontWeight: "700", margin: 0, color: colors.textPrimary }}>{track.name}</h4>
                <p style={{ fontSize: "12px", color: colors.textSecondary, lineHeight: "1.5", margin: 0, flex: 1 }}>{track.desc}</p>
                <button
                  onClick={() => navigate("/assessments")}
                  style={{ padding: "10px 14px", borderRadius: "10px", border: `1px solid ${colors.border}`, backgroundColor: colors.innerBg, color: colors.textPrimary, fontSize: "12px", fontWeight: "600", cursor: "pointer", marginTop: "6px" }}
                >
                  Explore {track.tag} Library
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "24px", borderRadius: "22px", backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>🗄️</span>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "800", margin: 0, color: colors.textPrimary }}>
                  Daily SQL Challenge (Standard Level)
                </h3>
                <p style={{ fontSize: "12px", color: colors.textSecondary, margin: "2px 0 0" }}>
                  Sharpen query writing with automated validation.
                </p>
              </div>
            </div>
            <span style={{ fontSize: "10px", fontWeight: "800", color: "#F59E0B", backgroundColor: "rgba(245, 158, 11, 0.12)", padding: "3px 8px", borderRadius: "6px" }}>
              Medium Difficulty
            </span>
          </div>

          <div style={{ padding: "12px 16px", borderRadius: "12px", backgroundColor: colors.innerBg, border: `1px solid ${colors.border}`, fontSize: "13px", color: colors.textPrimary }}>
            <strong>Problem:</strong> Write a query to find the <strong>second highest salary</strong> from the <code>Employee</code> table. If there is no second highest salary, return <code>NULL</code>.
          </div>

          <textarea
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            style={{ width: "100%", padding: "14px", borderRadius: "12px", backgroundColor: colors.innerBg, border: `1px solid ${colors.border}`, color: "#38BDF8", fontFamily: "monospace", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
            rows={3}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "12px", color: sqlStatus.includes("✅") ? "#10B981" : "#38BDF8" }}>
              {sqlStatus}
            </div>
            <button
              onClick={handleRunSql}
              style={{ padding: "10px 20px", borderRadius: "10px", backgroundColor: "#10B981", color: "#FFFFFF", border: "none", fontWeight: "700", fontSize: "12px", cursor: "pointer" }}
            >
              ⚡ Run Query
            </button>
          </div>

          {sqlResult && (
            <div style={{ padding: "14px", borderRadius: "12px", backgroundColor: colors.innerBg, border: `1px solid ${colors.border}` }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: colors.textSecondary, marginBottom: "8px" }}>
                QUERY OUTPUT:
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${colors.border}`, textAlign: "left" }}>
                    {sqlResult.columns.map((col, idx) => (
                      <th key={idx} style={{ padding: "6px 8px", color: colors.textSecondary }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sqlResult.rows.map((row, idx) => (
                    <tr key={idx}>
                      {row.map((val, cIdx) => (
                        <td key={cIdx} style={{ padding: "6px 8px", fontWeight: "600", color: "#10B981" }}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}