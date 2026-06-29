export const siteContent = {
  name: "Zander Chi",
  title: "Math-CS @ UCSD",
  summary:
    "Building autonomous agent runtimes, recommendation engines, and relational data infrastructure — from matrix factorization to GPU-accelerated solvers.",
  skills: ["TypeScript", "Python", "PyTorch", "SQL", "LangGraph", "Postgres"],
  contacts: [
    { label: "GitHub", href: "https://github.com/", description: "Source and project repos", icon: "github" },
    { label: "YouTube", href: "https://youtube.com/", description: "Product demos and walkthroughs", icon: "play" },
    { label: "Docs", href: "https://example.com", description: "Spec, notes, and writeups", icon: "doc" }
  ] as ContactLink[],
  deploySteps: [
    { title: "Push to GitHub", body: "Commit the portfolio repo and connect it to Vercel." },
    { title: "Set env vars", body: "Add `GROQ_API_KEY`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `AUTH_SECRET`." },
    { title: "Deploy preview", body: "Use Vercel preview deploys to verify the assistant and dashboard." },
    { title: "Promote production", body: "Merge to main and promote the latest deployment after a final smoke test." }
  ] as DeployStep[],
  footerStats: [
    { label: "systems tracked", value: "6" },
    { label: "model tier", value: "groq/compound" }
  ]
};

export const projectSeed = [
  {
    id: "zander-agent",
    tier: "Tier 1",
    name: "Zander 8.0 Agent",
    subtitle: "Autonomous multi-agent runtime",
    description:
      "Self-orchestrating agent mesh with a planner/executor split, tool routing, and a durable memory bus for long-horizon tasks.",
    tags: ["TypeScript", "LangGraph", "Python", "Redis"],
    githubUrl: "https://github.com/",
    youtubeUrl: "https://youtube.com/",
    docsUrl: "https://example.com",
    imageUrl:
      "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.45), transparent 18%), radial-gradient(circle at 80% 15%, rgba(168,85,247,0.3), transparent 18%), linear-gradient(135deg, #0b1020 0%, #05070b 100%)",
    accent: "violet",
  },
  {
    id: "recsys",
    tier: "Tier 1",
    name: "Standalone RecSys Machine",
    subtitle: "Matrix factorization at scale",
    description:
      "End-to-end recommendation engine: ALS + neural retrieval, embedding store, and a low-latency ranking service.",
    tags: ["Python", "PyTorch", "SQL", "FastAPI"],
    githubUrl: "https://github.com/",
    youtubeUrl: "https://youtube.com/",
    docsUrl: "https://example.com",
    imageUrl:
      "radial-gradient(circle at 15% 30%, rgba(34,211,238,0.32), transparent 20%), radial-gradient(circle at 75% 22%, rgba(168,85,247,0.24), transparent 24%), linear-gradient(135deg, #09111a 0%, #05070b 100%)",
    accent: "cyan",
  },
  {
    id: "warehouse",
    tier: "Tier 2",
    name: "Relational Analytics Warehouse",
    subtitle: "Columnar OLAP + dbt lineage",
    description:
      "A queryable project intelligence layer with materialized views, lineage tracking, and dashboard-ready metrics.",
    tags: ["dbt", "Postgres", "DuckDB", "Analytics"],
    githubUrl: "https://github.com/",
    youtubeUrl: "https://youtube.com/",
    docsUrl: "https://example.com",
    imageUrl:
      "radial-gradient(circle at 20% 15%, rgba(99,102,241,0.25), transparent 18%), radial-gradient(circle at 65% 70%, rgba(168,85,247,0.18), transparent 22%), linear-gradient(135deg, #0b0c12 0%, #05070b 100%)",
    accent: "violet",
  }
];

export type Project = (typeof projectSeed)[number];
export type ContactLink = {
  label: string;
  href: string;
  description: string;
  icon: "github" | "play" | "youtube" | "doc" | "send" | "settings" | "lock";
};
export type DeployStep = {
  title: string;
  body: string;
};
