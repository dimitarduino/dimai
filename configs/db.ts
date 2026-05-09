import "server-only";

import { drizzle } from "drizzle-orm/neon-serverless";

const connectionString =
  process.env.DATABASE_URL ?? process.env.NEXT_PUBLIC_DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "Missing DATABASE_URL (or NEXT_PUBLIC_DATABASE_URL as a temporary fallback).",
  );
}

export const db = drizzle(connectionString);
