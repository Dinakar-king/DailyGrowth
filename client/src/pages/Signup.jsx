import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", agree: false });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.agree) {
      setError("Please accept the terms and conditions to continue.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to create account");

      loginUser(data);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.cardContainer}>
        
        {/* Left Form Section */}
        <div style={styles.formSection}>
          {/* Brand Header */}
          <div style={styles.brandRow}>
            <div style={styles.logoBadge}>
              <span style={{ fontSize: "16px" }}>⚡</span>
            </div>
            <span style={styles.brandTitle}>DailyGrowth</span>
          </div>

          <div style={styles.headingGroup}>
            <h1 style={styles.mainHeading}>Create Account</h1>
            <p style={styles.subHeading}>Start your daily interview preparation journey.</p>
          </div>

          {error && <div style={styles.errorBanner}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Full Name Field */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Carter"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={styles.input}
              />
            </div>

            {/* Email Field */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={styles.input}
              />
            </div>

            {/* Password Field with Eye Toggle */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={styles.passwordInput}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>

            {/* Terms Agreement Checkbox */}
            <div style={styles.optionsRow}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.agree}
                  onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                  style={{ accentColor: "#0f766e" }}
                />
                I agree to the Terms of Service & Privacy Policy
              </label>
            </div>

            {/* Buttons Row */}
            <div style={styles.buttonRow}>
              <button
                type="submit"
                disabled={loading}
                style={{ ...styles.btnPrimary, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>

              <Link to="/login" style={styles.btnSecondary}>
                Back to Login
              </Link>
            </div>
          </form>

          {/* Footer Note */}
          <div style={styles.legalNotice}>
            Join thousands of students and developers leveling up their careers daily.
          </div>
        </div>

        {/* Right Art Section */}
        <div style={styles.artSection}>
          <div style={styles.glowOverlay} />
          
          <div style={styles.artContent}>
            <div style={styles.streakBadge}>
              <span style={{ fontSize: "38px" }}>🚀</span>
              <h3 style={styles.artTitle}>Accelerate Growth</h3>
              <p style={styles.artSub}>
                Access tailored DSA tracks, aptitude drills, and an intelligent AI coach.
              </p>
            </div>
          </div>

          <div style={styles.artControls}>
            <span style={styles.pillBtn}>←</span>
            <span style={{ ...styles.pillBtn, background: "#ffffff", color: "#064e3b" }}>1</span>
            <span style={styles.pillBtn}>→</span>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "#FDF8F0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    boxSizing: "border-box",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  cardContainer: {
    display: "flex",
    width: "100%",
    maxWidth: "960px",
    minHeight: "600px",
    backgroundColor: "#ffffff",
    borderRadius: "28px",
    border: "2px solid #064E3B",
    overflow: "hidden",
    boxShadow: "0 25px 50px -12px rgba(6, 78, 59, 0.15)",
  },
  formSection: {
    flex: "1 1 50%",
    padding: "44px 48px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoBadge: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    backgroundColor: "#ecfdf5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #a7f3d0",
  },
  brandTitle: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: "-0.5px",
  },
  headingGroup: {
    marginTop: "20px",
    marginBottom: "16px",
  },
  mainHeading: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#1e1b4b",
    margin: "0 0 4px 0",
  },
  subHeading: {
    fontSize: "13px",
    color: "#64748b",
    margin: 0,
  },
  errorBanner: {
    padding: "10px 14px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "10px",
    color: "#b91c1c",
    fontSize: "12px",
    marginBottom: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  label: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#94a3b8",
    textTransform: "capitalize",
  },
  input: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1.5px solid #cbd5e1",
    backgroundColor: "#ffffff",
    fontSize: "13px",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
    width: "100%",
  },
  passwordWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  passwordInput: {
    padding: "12px 42px 12px 16px",
    borderRadius: "12px",
    border: "1.5px solid #cbd5e1",
    backgroundColor: "#ffffff",
    fontSize: "13px",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
    width: "100%",
  },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  },
  optionsRow: {
    display: "flex",
    alignItems: "center",
    fontSize: "12px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#64748b",
    cursor: "pointer",
    fontSize: "11px",
  },
  buttonRow: {
    display: "flex",
    gap: "12px",
    marginTop: "8px",
  },
  btnPrimary: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#0d5c4d",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },
  btnSecondary: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#ffffff",
    color: "#1e293b",
    border: "1.5px solid #cbd5e1",
    borderRadius: "12px",
    fontSize: "13px",
    fontWeight: "600",
    textAlign: "center",
    textDecoration: "none",
    boxSizing: "border-box",
  },
  legalNotice: {
    fontSize: "10px",
    color: "#94a3b8",
    marginTop: "18px",
    lineHeight: "1.4",
  },
  artSection: {
    flex: "1 1 50%",
    position: "relative",
    backgroundColor: "#064e3b",
    backgroundImage: "radial-gradient(circle at top right, #047857 0%, #064e3b 60%, #022c22 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "36px",
    boxSizing: "border-box",
  },
  glowOverlay: {
    position: "absolute",
    inset: 0,
    backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
    backgroundSize: "18px 18px",
  },
  artContent: {
    position: "relative",
    zIndex: 2,
    margin: "auto 0",
    textAlign: "center",
  },
  streakBadge: {
    backgroundColor: "rgba(2, 44, 34, 0.45)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    padding: "32px 24px",
    borderRadius: "24px",
    color: "#ffffff",
  },
  artTitle: {
    fontSize: "22px",
    fontWeight: "800",
    marginTop: "12px",
    marginBottom: "6px",
    color: "#f0fdf4",
  },
  artSub: {
    fontSize: "12px",
    color: "#a7f3d0",
    margin: 0,
    lineHeight: "1.5",
  },
  artControls: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    justifyContent: "flex-end",
    gap: "6px",
  },
  pillBtn: {
    padding: "6px 12px",
    borderRadius: "8px",
    backgroundColor: "rgba(255,255,255,0.12)",
    color: "#ffffff",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "pointer",
  },
};