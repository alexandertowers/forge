import { drizzle } from 'drizzle-orm/neon-http';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set in your environment");
}

export const db = drizzle(process.env.DATABASE_URL);
