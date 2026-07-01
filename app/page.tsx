export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { PortfolioPage } from "../components/portfolio-page";
import { headers } from "next/headers";
import type { Project } from "../lib/site-content";

export default async function Page() {
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "http";

  let projects: Project[] = [];

  if (host) {
    try {
      const response = await fetch(new URL("/api/projects", `${protocol}://${host}`), {
        cache: "no-store"
      });

      if (response.ok) {
        const data = (await response.json()) as { projects?: Project[] };
        projects = Array.isArray(data.projects) ? data.projects : [];
      }
    } catch {
      projects = [];
    }
  }

  return <PortfolioPage projects={projects} />;
}
