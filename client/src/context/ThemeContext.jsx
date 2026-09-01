import React, { createContext, useState, useEffect, useContext } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("dg_theme") || "dark"
  );

  useEffect(() => {
    localStorage.setItem("dg_theme", theme);
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const isDark = theme === "dark";

  const colors = {
    bg: isDark ? "#060A16" : "#F8FAFC",
    cardBg: isDark ? "#0D1527" : "#FFFFFF",
    innerBg: isDark ? "#080E1E" : "#F1F5F9",
    border: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
    textPrimary: isDark ? "#F8FAFC" : "#0F172A",
    textSecondary: isDark ? "#94A3B8" : "#64748B",
    accent: "#0284C7",
    accentHover: "#38BDF8",
    inputBorder: isDark ? "#1E293B" : "#CBD5E1",
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);