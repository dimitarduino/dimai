"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("dark") === "true";
    setIsDark(stored);
    document.documentElement.classList.toggle("dark", stored);
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDark;
    localStorage.setItem("dark", nextTheme);
    setIsDark(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme);
  };

  if (isDark === null) return null;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);