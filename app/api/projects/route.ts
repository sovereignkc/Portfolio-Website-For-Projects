import { NextRequest, NextResponse } from "next/server";
import { verifyAuthCookie } from "../../../lib/auth";
import { getProjects, updateProjects } from "../../../lib/projects";
import type { Project } from "../../../lib/site-content";

function isAuthed(request: NextRequest) {
  const cookie = request.cookies.get("portfolio_admin")?.value;
  return cookie ? verifyAuthCookie(cookie) : false;
}

export async function GET() {
  return NextResponse.json({ projects: getProjects() });
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthed(request))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = (await request.json()) as { projects?: Project[] };
  if (!Array.isArray(body.projects)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const projects = updateProjects(body.projects);
  return NextResponse.json({ ok: true, projects });
}
