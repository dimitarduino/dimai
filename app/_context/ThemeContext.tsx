"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type ThemeContextType = {
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: React.JSX.Element }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("dark") === "true";
    setIsDark(stored);
    document.documentElement.classList.toggle("dark", stored);
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDark;
    localStorage.setItem("dark", nextTheme ? "true" : "false");
    setIsDark(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
};