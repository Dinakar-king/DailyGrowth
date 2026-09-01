import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { fetchWithAuth } from "../api";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginUser } = useContext(AuthContext);
  const { colors, isDark } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      setError("Please agree to the Terms of Service to continue.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const data = await fetchWithAuth("/auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      loginUser(data);
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
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
          minHeight: "560px",
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
        {/* Left Section - Form */}
        <div
          style={{
            padding: "48px 44px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "28px",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "3px",
                  backgroundColor: "#0284C7",
                }}
              />
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "900",
                  letterSpacing: "-0.5px",
                  color: colors.textPrimary,
                }}
              >
                Daily<span style={{ color: "#38BDF8" }}>Growth</span>
              </span>
            </div>

            <h1
              style={{
                fontSize: "30px",
                fontWeight: "800",
                color: colors.textPrimary,
                margin: "0 0 8px",
                letterSpacing: "-0.8px",
              }}
            >
              Create Account
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: colors.textSecondary,
                margin: "0 0 24px",
              }}
            >
              Start your daily interview preparation journey.
            </p>

            {error && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(239, 68, 68, 0.12)",
                  border: "1px solid #EF4444",
                  color: "#EF4444",
                  fontSize: "12px",
                  fontWeight: "600",
                  marginBottom: "18px",
                }}
              >
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: "700",
                    color: colors.textSecondary,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "6px",
                  }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "13px 16px",
                    borderRadius: "12px",
                    backgroundColor: colors.innerBg,
                    border: `1.5px solid ${colors.inputBorder}`,
                    color: colors.textPrimary,
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: "700",
                    color: colors.textSecondary,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "6px",
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="candidate@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "13px 16px",
                    borderRadius: "12px",
                    backgroundColor: colors.innerBg,
                    border: `1.5px solid ${colors.inputBorder}`,
                    color: colors.textPrimary,
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: "700",
                    color: colors.textSecondary,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "6px",
                  }}
                >
                  Password
                </label>
                <div style={{ position: "relative", width: "100%" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "13px 44px 13px 16px",
                      borderRadius: "12px",
                      backgroundColor: colors.innerBg,
                      border: `1.5px solid ${colors.inputBorder}`,
                      color: colors.textPrimary,
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: colors.textSecondary,
                    }}
                  >
                    {showPassword ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                        <line x1="2" y1="2" x2="22" y2="22" />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "12px",
                  color: colors.textSecondary,
                  gap: "8px",
                }}
              >
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  style={{ accentColor: "#0284C7", cursor: "pointer" }}
                />
                <span>I agree to the Terms of Service & Privacy Policy</span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginTop: "8px",
                }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "13px",
                    borderRadius: "12px",
                    backgroundColor: "#0284C7",
                    backgroundImage:
                      "linear-gradient(135deg, #0284C7, #0369A1)",
                    color: "#FFFFFF",
                    border: "none",
                    fontWeight: "700",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  {loading ? "Creating..." : "Sign Up"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  style={{
                    padding: "13px",
                    borderRadius: "12px",
                    backgroundColor: "transparent",
                    border: `1.5px solid ${colors.border}`,
                    color: colors.textPrimary,
                    fontWeight: "700",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Back to Login
                </button>
              </div>
            </form>
          </div>

          <p
            style={{
              fontSize: "11px",
              color: colors.textSecondary,
              marginTop: "24px",
              lineHeight: "1.5",
            }}
          >
            Join thousands of students and developers leveling up their careers daily.
          </p>
        </div>

        {/* Right Section - Highlight banner */}
        <div
          style={{
            position: "relative",
            background: isDark
              ? "linear-gradient(135deg, #0f172a 0%, #0369a1 50%, #0f766e 100%)"
              : "linear-gradient(135deg, #0284c7 0%, #06b6d4 50%, #10b981 100%)",
            padding: "48px 36px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "#FFFFFF",
            overflow: "hidden",
          }}
        >
          <div style={{ zIndex: 1 }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "800",
                letterSpacing: "0.5px",
                padding: "6px 14px",
                borderRadius: "20px",
                backgroundColor: "rgba(255, 255, 255, 0.18)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
              }}
            >
              🚀 DAILY PLACEMENT DRILLS
            </span>
          </div>

          <div style={{ zIndex: 1, margin: "32px 0" }}>
            <h2
              style={{
                fontSize: "26px",
                fontWeight: "900",
                lineHeight: "1.3",
                marginBottom: "12px",
              }}
            >
              Accelerate Growth with Structured Practice
            </h2>
            <p
              style={{
                fontSize: "13px",
                lineHeight: "1.6",
                color: "rgba(255, 255, 255, 0.85)",
                margin: 0,
              }}
            >
              Access tailored DSA tracks, aptitude drills, audio verbal assessments, and daily SQL challenges.
            </p>
          </div>

          <div
            style={{
              zIndex: 1,
              backgroundColor: "rgba(255, 255, 255, 0.14)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              borderRadius: "16px",
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: "11px", fontWeight: "700", opacity: 0.85 }}>
                INSTANT EVALUATION
              </div>
              <div style={{ fontSize: "14px", fontWeight: "800", marginTop: "2px" }}>
                Continuous Streak Tracking
              </div>
            </div>
            <div style={{ fontSize: "24px" }}>🎯</div>
          </div>
        </div>
      </div>
    </div>
  );
}