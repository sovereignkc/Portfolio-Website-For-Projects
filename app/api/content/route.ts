import { NextRequest, NextResponse } from "next/server";
import { verifyAuthCookie } from "../../../lib/auth";
import { getDashboardContent, updateDashboardContent } from "../../../lib/content-store";
import type { ContactLink, DeployStep, Project } from "../../../lib/site-content";

async function isAuthed(request: NextRequest) {
  const cookie = request.cookies.get("portfolio_admin")?.value;
  return cookie ? await verifyAuthCookie(cookie) : false;
}

export async function GET() {
  return NextResponse.json(await getDashboardContent());
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthed(request))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = (await request.json()) as Partial<{
    projects: Project[];
    contacts: ContactLink[];
    deploySteps: DeployStep[];
  }>;

  if (!Array.isArray(body.projects) || !Array.isArray(body.contacts) || !Array.isArray(body.deploySteps)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const content = updateDashboardContent({
    projects: body.projects,
    contacts: body.contacts,
    deploySteps: body.deploySteps
  });

  return NextResponse.json({ ok: true, ...content });
}
