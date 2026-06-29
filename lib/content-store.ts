import postgres from "postgres";
import { siteContent, projectSeed } from "./site-content";
import type { ContactLink, DeployStep, Project } from "./site-content";

type DashboardContent = {
  projects: Project[];
  contacts: ContactLink[];
  deploySteps: DeployStep[];
};

const CONTENT_ID = "dashboard-content";

const globalForContent = globalThis as typeof globalThis & {
  __portfolioContentStore?: DashboardContent;
  __portfolioContentReady?: boolean;
  __portfolioSql?: ReturnType<typeof postgres>;
};

const sql =
  globalForContent.__portfolioSql ??
  postgres(process.env.DATABASE_URL ?? "", {
    ssl: process.env.NODE_ENV === "production" ? "require" : undefined
  });

globalForContent.__portfolioSql = sql;

function defaultContent(): DashboardContent {
  return {
    projects: projectSeed.map((project) => ({ ...project, tags: [...project.tags] })),
    contacts: siteContent.contacts.map((contact) => ({ ...contact })),
    deploySteps: siteContent.deploySteps.map((step) => ({ ...step }))
  };
}

function cloneContent(content: DashboardContent): DashboardContent {
  return {
    projects: content.projects.map((project) => ({ ...project, tags: [...project.tags] })),
    contacts: content.contacts.map((contact) => ({ ...contact })),
    deploySteps: content.deploySteps.map((step) => ({ ...step }))
  };
}

async function ensureTable() {
  if (globalForContent.__portfolioContentReady) {
    return;
  }

  await sql`
    CREATE TABLE IF NOT EXISTS portfolio_content (
      id TEXT PRIMARY KEY,
      content JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  globalForContent.__portfolioContentReady = true;
}

async function readDbContent() {
  try {
    await ensureTable();
    const rows = await sql<[{ content: DashboardContent }]>`
      SELECT content
      FROM portfolio_content
      WHERE id = ${CONTENT_ID}
      LIMIT 1
    `;

    const row = rows[0];
    return row?.content ? cloneContent(row.content) : null;
  } catch {
    return null;
  }
}

async function writeDbContent(content: DashboardContent) {
  try {
    await ensureTable();
    await sql`
      INSERT INTO portfolio_content (id, content, updated_at)
      VALUES (${CONTENT_ID}, ${JSON.stringify(cloneContent(content))}::jsonb, NOW())
      ON CONFLICT (id)
      DO UPDATE SET content = EXCLUDED.content, updated_at = NOW()
    `;
    return true;
  } catch {
    return false;
  }
}

export async function getDashboardContent() {
  const stored = await readDbContent();
  if (stored) {
    globalForContent.__portfolioContentStore = cloneContent(stored);
    return stored;
  }

  if (!globalForContent.__portfolioContentStore) {
    globalForContent.__portfolioContentStore = defaultContent();
  }

  return cloneContent(globalForContent.__portfolioContentStore);
}

export async function updateDashboardContent(nextContent: DashboardContent) {
  const cloned = cloneContent(nextContent);
  globalForContent.__portfolioContentStore = cloned;
  await writeDbContent(cloned);
  return cloneContent(cloned);
}

export async function resetDashboardContent() {
  const content = defaultContent();
  await writeDbContent(content);
  globalForContent.__portfolioContentStore = cloneContent(content);
  return cloneContent(content);
}

export type { DashboardContent };
