"use client"

import type { CSSProperties, ComponentProps } from "react";
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";

type ThemeType = "system" | "light" | "dark"

const sonnerStyle = {
  "--normal-bg": "var(--popover)",
  "--normal-text": "var(--popover-foreground)",
  "--normal-border": "var(--border)",
} as CSSProperties;

const Toaster = ({
  ...props
}: ComponentProps<typeof Sonner>) => {
  const { theme = "system" } = useTheme()

  return (
    (<Sonner
      theme={theme as ThemeType}
      className="toaster group"
      style={sonnerStyle}
      {...props} />)
  );
}

export { Toaster }
