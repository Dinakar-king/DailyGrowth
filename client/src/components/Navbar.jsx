import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const { isDark, toggleTheme, colors } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <header
      style={{
        height: "64px",
        backgroundColor: colors.cardBg,
        borderBottom: `1px solid ${colors.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        position: "sticky",
        top: 0,
        zIndex: 50,
        transition: "background-color 0.2s ease, border-color 0.2s ease",
      }}
    >
      {/* Brand & Main Navigation */}
      <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
        <Link
          to="/"
          style={{
            fontSize: "20px",
            fontWeight: "900",
            textDecoration: "none",
            color: colors.textPrimary,
            letterSpacing: "-0.5px",
          }}
        >
          Daily<span style={{ color: "#38BDF8" }}>Growth</span>
        </Link>

        {user && (
          <nav style={{ display: "flex", gap: "18px", alignItems: "center" }}>
            <Link
              to="/"
              style={{
                fontSize: "13px",
                fontWeight: "600",
                textDecoration: "none",
                color: colors.textSecondary,
              }}
            >
              Dashboard
            </Link>
            <Link
              to="/assessments"
              style={{
                fontSize: "13px",
                fontWeight: "600",
                textDecoration: "none",
                color: colors.textSecondary,
              }}
            >
              Assessments
            </Link>
            <Link
              to="/profile"
              style={{
                fontSize: "13px",
                fontWeight: "600",
                textDecoration: "none",
                color: colors.textSecondary,
              }}
            >
              Profile
            </Link>
            {user.role === "admin" && (
              <Link
                to="/admin"
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  textDecoration: "none",
                  backgroundColor: "rgba(56, 189, 248, 0.15)",
                  color: "#38BDF8",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                }}
              >
                Admin Portal
              </Link>
            )}
          </nav>
        )}
      </div>

      {/* Right Action Items */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {/* Universal Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            padding: "6px 14px",
            borderRadius: "20px",
            border: `1px solid ${colors.border}`,
            backgroundColor: colors.innerBg,
            color: colors.textPrimary,
            fontSize: "12px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {/* Streak Counter Pill */}
            <span
              style={{
                fontSize: "11px",
                fontWeight: "800",
                color: "#F59E0B",
                backgroundColor: isDark ? "rgba(245, 158, 11, 0.12)" : "#FEF3C7",
                padding: "4px 10px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              🔥 {user.streak || 0}d
            </span>

            {/* Profile Avatar Link */}
            <Link
              to="/profile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "#0284C7",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: "800",
                }}
              >
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: colors.textPrimary,
                }}
              >
                {user.name}
              </span>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                backgroundColor: "transparent",
                border: `1px solid ${colors.border}`,
                color: "#EF4444",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "8px" }}>
            <Link
              to="/login"
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "600",
                textDecoration: "none",
                color: colors.textPrimary,
              }}
            >
              Log In
            </Link>
            <Link
              to="/signup"
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "700",
                textDecoration: "none",
                backgroundColor: "#0284C7",
                color: "#fff",
              }}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}