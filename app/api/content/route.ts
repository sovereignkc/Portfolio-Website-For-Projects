export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { verifyAuthCookie } from "../../../lib/auth";
import { getProjects, updateProjects } from "../../../lib/projects";

async function isAuthed(request: NextRequest) {
  const cookie = request.cookies.get("portfolio_admin")?.value;
  return cookie ? verifyAuthCookie(cookie) : false;
}

export async function GET() {
  try {
    const projects = await getProjects();
    // Wrap it in whatever top-level structural object key the dashboard expects
    return NextResponse.json({ projects, content: { projects } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthed(request))) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Extract the projects array regardless of whether Codex nested it under body.projects or body.content.projects
    const incomingProjects = body.projects || body.content?.projects || body.content;

    if (!Array.isArray(incomingProjects)) {
      return NextResponse.json({ ok: false, error: "Malformed payload layout structure" }, { status: 400 });
    }

    const updated = await updateProjects(incomingProjects);
    return NextResponse.json({ ok: true, projects: updated, content: { projects: updated } });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}