"use client";

import React from "react";
import { ElementProps } from "@/types/elements";

/** Passthrough wrapper so marketing routes never call Clerk hooks during prerender/build. */
export default function Provider({ children }: ElementProps): React.JSX.Element {
  return <>{children}</>;
}
