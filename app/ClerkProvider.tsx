"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark, neobrutalism } from "@clerk/themes";
import { useEffect, useState } from "react";
import { useTheme } from "./_context/ThemeContext";
import type { ThemeContextType } from "./_context/ThemeContext";

export default function ClerkWithThemeProvider({ children } : { children: React.ReactNode }) : React.JSX.Element {
  const { isDark, toggleTheme } = useTheme() ?? { isDark: false, toggleTheme: () => {} } as ThemeContextType;

  return (
    <ClerkProvider
      appearance={{
        baseTheme: isDark ? dark : neobrutalism,
        variables: {
          colorPrimary: "#059485",
        },
      }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/app"
      afterSignUpUrl="/app"
    >
      {children}
    </ClerkProvider>
  );
}