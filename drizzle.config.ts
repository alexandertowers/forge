import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not found in environment");
}

export default defineConfig({
  schema: "./lib/schema.ts", // Adjust this path if your schema file is elsewhere
  out: "./migrations",       // Folder where migration files will be generated
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  strict: true,
});
