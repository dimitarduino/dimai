"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark, neobrutalism } from "@clerk/themes";
import { useEffect, useState } from "react";
import { useTheme } from "./_context/ThemeContext";

export default function ClerkWithThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { isDark } = useTheme();
  // Avoid coupling Clerk appearance to theme until client mount (localStorage sync).
  const baseTheme = mounted && isDark ? dark : neobrutalism;

  return (
    <ClerkProvider
      appearance={{
        theme: baseTheme,
        variables: { colorPrimary: "#059485" },
      }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/app"
      signUpFallbackRedirectUrl="/app"
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProvider>
  );
}
