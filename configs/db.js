import { drizzle } from "drizzle-orm/neon-serverless";
export const db = drizzle(process.env.NEXT_PUBLIC_DATABASE_URL);