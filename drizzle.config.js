import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: 'postgresql', // 'mysql' | 'sqlite' | 'turso'
  schema: './configs/schema.js',
  dbCredentials: {
    url: 'postgresql://aishort_owner:npg_MNctmyv6lOb5@ep-fancy-boat-a5txz2p4-pooler.us-east-2.aws.neon.tech/aishort?sslmode=require'
  }
})