import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, serial, jsonb } from 'drizzle-orm/pg-core';
import { projectSeed, type Project } from "./site-content";

// 1. Define the SQL table configuration architecture
export const portfolioTable = pgTable('portfolio_projects', {
  id: serial('id').primaryKey(),
  content: jsonb('content').notNull(), // Stores your project card array safely as scalable JSONB
});

// 2. Initialize the direct database connection path
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export async function getProjects(): Promise<Project[]> {
  try {
    const result = await db.select().from(portfolioTable).limit(1);
    
    // Fallback cleanly to your default seed items if the cloud table is empty
    if (result.length === 0) {
      return projectSeed;
    }
    
    return result[0].content as Project[];
  } catch (error) {
    console.error("🚨 Neon Postgres read execution failure:", error);
    return projectSeed;
  }
}

export async function updateProjects(nextProjects: Project[]): Promise<Project[]> {
  try {
    // Clear out the stale entry and override it with the live dashboard state
    await db.delete(portfolioTable);
    const result = await db.insert(portfolioTable)
      .values({ content: nextProjects })
      .returning();
      
    return result[0].content as Project[];
  } catch (error) {
    console.error("🚨 Neon Postgres write execution failure:", error);
    return nextProjects;
  }
}