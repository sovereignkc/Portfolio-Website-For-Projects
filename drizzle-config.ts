import { defineConfig } from "drizzle-kit";
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './lib/content-store';

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/content-store.ts", 
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
});