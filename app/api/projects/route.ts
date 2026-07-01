export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";import { verifyAuthCookie } from "../../../lib/auth";
import { getProjects, updateProjects } from "../../../lib/projects";
import type { Project } from "../../../lib/site-content";

// Helper to double-check admin authentication cookies safely
async function isAuthed(request: NextRequest) {
  const cookie = request.cookies.get("portfolio_admin")?.value;
  return cookie ? verifyAuthCookie(cookie) : false;
}

export async function GET() {
  // Added await to cleanly stream database contents
  const projects = await getProjects();
  return NextResponse.json({ projects });
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthed(request))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = (await request.json()) as { projects?: Project[] };
  if (!Array.isArray(body.projects)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // FIXED: Added await here so the serverless function holds open until Postgres writes
  const projects = await updateProjects(body.projects);
  return NextResponse.json({ ok: true, projects });
}