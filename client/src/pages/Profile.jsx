import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { fetchWithAuth } from "../api";

export default function Profile() {
  const { colors } = useTheme();
  const [stats, setStats] = useState({
    totalSessions: 0,
    avgAccuracy: 0,
    attempts: [],
    user: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth("/exam/profile-stats")
      .then((data) => setStats(data))
      .catch((err) => console.error("Failed to load profile:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: colors.textSecondary }}>
        Loading student profile...
      </div>
    );
  }

  const last14Days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const isAttended = i >= 14 - (stats.user?.streak || 0);
    return {
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.getDate(),
      attended: isAttended,
    };
  });

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", backgroundColor: colors.bg, padding: "36px 24px 80px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
        
        <div style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: "22px", padding: "28px", display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#0284C7", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: "800" }}>
            {stats.user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "22px", fontWeight: "800", color: colors.textPrimary, margin: "0 0 4px" }}>
              {stats.user?.name}
            </h1>
            <p style={{ fontSize: "13px", color: colors.textSecondary, margin: 0 }}>
              {stats.user?.email} • Member since {new Date(stats.user?.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
          <div style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: "18px", padding: "20px" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: colors.textSecondary, textTransform: "uppercase" }}>Current Streak</div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#F59E0B", marginTop: "6px" }}>
              🔥 {stats.user?.streak || 0} Days
            </div>
          </div>

          <div style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: "18px", padding: "20px" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: colors.textSecondary, textTransform: "uppercase" }}>Sessions Attended</div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#38BDF8", marginTop: "6px" }}>
              📚 {stats.totalSessions} Sessions
            </div>
          </div>

          <div style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: "18px", padding: "20px" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: colors.textSecondary, textTransform: "uppercase" }}>Overall Accuracy</div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#10B981", marginTop: "6px" }}>
              🎯 {stats.avgAccuracy}%
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: "22px", padding: "28px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "800", color: colors.textPrimary, margin: "0 0 16px" }}>
            14-Day Consistency Track
          </h3>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", overflowX: "auto", paddingBottom: "8px" }}>
            {last14Days.map((item, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", minWidth: "40px" }}>
                <div
                  style={{
                    width: "100%",
                    height: "70px",
                    borderRadius: "10px",
                    backgroundColor: item.attended ? "#0284C7" : colors.innerBg,
                    border: `1px solid ${colors.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "14px",
                  }}
                >
                  {item.attended ? "🔥" : "⚪"}
                </div>
                <span style={{ fontSize: "10px", color: colors.textSecondary, fontWeight: "700" }}>{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: "22px", padding: "28px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "800", color: colors.textPrimary, margin: "0 0 16px" }}>
            Attended Sessions History
          </h3>
          {stats.attempts.length === 0 ? (
            <p style={{ color: colors.textSecondary, fontSize: "13px" }}>No assessment attempts yet. Start today's test to begin your record!</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {stats.attempts.map((att, i) => (
                <div key={i} style={{ backgroundColor: colors.innerBg, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ color: colors.textPrimary, textTransform: "uppercase", fontSize: "13px" }}>{att.category} Assessment</strong>
                    <div style={{ fontSize: "11px", color: colors.textSecondary, marginTop: "2px" }}>
                      {new Date(att.createdAt).toLocaleDateString()} at {new Date(att.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <span style={{ fontSize: "16px", fontWeight: "800", color: att.score >= 70 ? "#10B981" : "#EF4444" }}>
                    {att.score}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}