export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { verifyAuthCookie } from "../../../lib/auth";
import { getProjects, updateProjects } from "../../../lib/projects";
import type { Project } from "../../../lib/site-content";

async function isAuthed(request: NextRequest) {
  const cookie = request.cookies.get("portfolio_admin")?.value;
  return cookie ? verifyAuthCookie(cookie) : false;
}

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load projects";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthed(request))) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { projects?: Project[] };

    if (!Array.isArray(body.projects)) {
      return NextResponse.json({ ok: false, error: "Expected payload shape { projects: Project[] }" }, { status: 400 });
    }

    const projects = await updateProjects(body.projects);
    return NextResponse.json({ ok: true, projects });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save projects";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
