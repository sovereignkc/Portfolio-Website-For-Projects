import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { portfolioTable } from './lib/projects';

const url = process.env.DATABASE_URL ?? "";

async function main() {
  console.log("🔨 Constructing the live portfolio table structural map...");
  const sql = neon(url);
  
  // Directly execute raw SQL to make sure the table exists instantly
  await sql`
    CREATE TABLE IF NOT EXISTS portfolio_projects (
      id SERIAL PRIMARY KEY,
      content JSONB NOT NULL
    );
  `;
  console.log("Checkmate! The table is permanently alive inside Neon Postgres.");
}

main().catch(console.error);