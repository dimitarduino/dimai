"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark, neobrutalism } from "@clerk/themes";
import { useEffect, useState } from "react";
import { useTheme } from "./_context/ThemeContext";

export default function ClerkWithThemeProvider({ children }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <ClerkProvider
      appearance={{
        baseTheme: isDark ? dark : neobrutalism,
        variables: {
          colorPrimary: "#059485",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}