"use client";

import { createContext } from "react";

/** Bottom nav visibility for /app dashboard (cannot live in layout.jsx exports on Next 15+). */
export const MobileNavContext = createContext({
  showBottomNav: true,
  setShowBottomNav: () => {},
});
