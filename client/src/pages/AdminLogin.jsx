import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { fetchWithAuth } from "../api";

export default function AdminLogin() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    subjectDomain: "DSA & Problem Solving",
    staffKey: "TEACHER2026",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginUser } = useContext(AuthContext);
  const { colors, isDark } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isRegisterMode ? "/auth/admin-register" : "/auth/login";

    try {
      const data = await fetchWithAuth(endpoint, {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!isRegisterMode && data.role !== "admin") {
        throw new Error("Access Denied: Account is not authorized as staff.");
      }

      loginUser(data);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        backgroundColor: colors.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        transition: "all 0.2s ease",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "960px",
          minHeight: "580px",
          backgroundColor: colors.cardBg,
          borderRadius: "28px",
          border: `1px solid ${colors.border}`,
          boxShadow: isDark
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.7)"
            : "0 20px 40px -15px rgba(0, 0, 0, 0.08)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "44px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                padding: "4px",
                borderRadius: "14px",
                backgroundColor: colors.innerBg,
                border: `1px solid ${colors.border}`,
                marginBottom: "24px",
              }}
            >
              <button
                type="button"
                onClick={() => { setIsRegisterMode(false); setError(""); }}
                style={{
                  padding: "8px 18px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: !isRegisterMode ? "#0284C7" : "transparent",
                  color: !isRegisterMode ? "#FFFFFF" : colors.textSecondary,
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Staff Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsRegisterMode(true); setError(""); }}
                style={{
                  padding: "8px 18px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: isRegisterMode ? "#0284C7" : "transparent",
                  color: isRegisterMode ? "#FFFFFF" : colors.textSecondary,
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                New Teacher / Admin
              </button>
            </div>

            <h1 style={{ fontSize: "26px", fontWeight: "800", color: colors.textPrimary, margin: "0 0 6px" }}>
              {isRegisterMode ? "Register Faculty Account" : "Faculty Command Center"}
            </h1>
            <p style={{ fontSize: "13px", color: colors.textSecondary, margin: "0 0 20px" }}>
              {isRegisterMode
                ? "Create dedicated examiner accounts for DSA, Aptitude, or Verbal prep."
                : "Sign in with administrative privileges to manage test batches and student feedback."}
            </p>

            {error && (
              <div style={{ padding: "10px 14px", borderRadius: "10px", backgroundColor: "rgba(239, 68, 68, 0.12)", border: "1px solid #EF4444", color: "#EF4444", fontSize: "12px", fontWeight: "600", marginBottom: "16px" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {isRegisterMode && (
                <>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: colors.textSecondary, textTransform: "uppercase", marginBottom: "4px" }}>
                      Instructor Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Prof. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", backgroundColor: colors.innerBg, border: `1.5px solid ${colors.inputBorder}`, color: colors.textPrimary, fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: colors.textSecondary, textTransform: "uppercase", marginBottom: "4px" }}>
                      Teaching Track Specialization
                    </label>
                    <select
                      value={formData.subjectDomain}
                      onChange={(e) => setFormData({ ...formData, subjectDomain: e.target.value })}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", backgroundColor: colors.innerBg, border: `1.5px solid ${colors.inputBorder}`, color: colors.textPrimary, fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                    >
                      <option value="DSA & Coding Lead">💻 Section 1: DSA & Coding Instructor</option>
                      <option value="Aptitude & Logic Lead">📊 Section 2: Quantitative Aptitude Trainer</option>
                      <option value="Communication & Verbal Coach">🗣️ Section 3: Communication & Verbal Coach</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: colors.textSecondary, textTransform: "uppercase", marginBottom: "4px" }}>
                  Official Staff Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="instructor@dailygrowth.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", backgroundColor: colors.innerBg, border: `1.5px solid ${colors.inputBorder}`, color: colors.textPrimary, fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: colors.textSecondary, textTransform: "uppercase", marginBottom: "4px" }}>
                  Security Key / Password
                </label>
                <div style={{ position: "relative", width: "100%" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    style={{ width: "100%", padding: "12px 42px 12px 14px", borderRadius: "10px", backgroundColor: colors.innerBg, border: `1.5px solid ${colors.inputBorder}`, color: colors.textPrimary, fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: colors.textSecondary }}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              {isRegisterMode && (
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: colors.textSecondary, textTransform: "uppercase", marginBottom: "4px" }}>
                    Staff Verification Passkey
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="TEACHER2026"
                    value={formData.staffKey}
                    onChange={(e) => setFormData({ ...formData, staffKey: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", backgroundColor: colors.innerBg, border: `1.5px solid ${colors.inputBorder}`, color: "#38BDF8", fontFamily: "monospace", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "13px",
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
                {loading ? "Verifying Staff..." : isRegisterMode ? "Create Faculty Account →" : "Access Admin Workspace →"}
              </button>
            </form>
          </div>

          <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span onClick={() => navigate("/login")} style={{ fontSize: "12px", color: colors.textSecondary, cursor: "pointer" }}>
              ← Back to Student Login
            </span>
            <span style={{ fontSize: "11px", color: "#38BDF8", fontWeight: "700" }}>
              Staff Key: <code>TEACHER2026</code>
            </span>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            background: isDark
              ? "linear-gradient(135deg, #091e3a 0%, #0369a1 60%, #0c4a6e 100%)"
              : "linear-gradient(135deg, #0284c7 0%, #0ea5e9 60%, #38bdf8 100%)",
            padding: "44px 36px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "#FFFFFF",
            overflow: "hidden",
          }}
        >
          <div style={{ zIndex: 1 }}>
            <span style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "0.5px", padding: "6px 14px", borderRadius: "20px", backgroundColor: "rgba(255, 255, 255, 0.18)", backdropFilter: "blur(8px)", border: "1px solid rgba(255, 255, 255, 0.25)" }}>
              🎓 3 FACULTY DOMAINS
            </span>
          </div>

          <div style={{ zIndex: 1, display: "flex", flexDirection: "column", gap: "12px", margin: "24px 0" }}>
            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.12)", backdropFilter: "blur(8px)", padding: "12px 16px", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.2)" }}>
              <div style={{ fontSize: "13px", fontWeight: "800" }}>💻 DSA & Coding Lead</div>
              <div style={{ fontSize: "11px", opacity: 0.85, marginTop: "2px" }}>Upload test cases, runtime constraints & evaluate Python/C++ code.</div>
            </div>

            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.12)", backdropFilter: "blur(8px)", padding: "12px 16px", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.2)" }}>
              <div style={{ fontSize: "13px", fontWeight: "800" }}>📊 Quantitative Aptitude Trainer</div>
              <div style={{ fontSize: "11px", opacity: 0.85, marginTop: "2px" }}>Batch publish up to 20+ multiple choice logic & speed math questions.</div>
            </div>

            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.12)", backdropFilter: "blur(8px)", padding: "12px 16px", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.2)" }}>
              <div style={{ fontSize: "13px", fontWeight: "800" }}>🗣️ Communication Coach</div>
              <div style={{ fontSize: "11px", opacity: 0.85, marginTop: "2px" }}>Upload listening audio files and inspect recorded candidate voice clips.</div>
            </div>
          </div>

          <div style={{ zIndex: 1, fontSize: "11px", opacity: 0.85 }}>
            Staff portal changes synchronize in real-time across candidate assessment rotations.
          </div>
        </div>
      </div>
    </div>
  );
}