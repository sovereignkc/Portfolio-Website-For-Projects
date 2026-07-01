export const dynamic = 'force-dynamic';
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
    console.log("📡 GET REQUEST: Successfully fetched projects count:", projects?.length);
    return NextResponse.json({ projects });
  } catch (err: any) {
    console.error("🚨 GET API ERROR:", err.message);
    return NextResponse.json({ projects: [], error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  console.log("🚀 PUT REQUEST: Incoming save transaction triggered...");
  
  if (!(await isAuthed(request))) {
    console.log("🚨 PUT FAILURE: Unauthorized admin cookie profile.");
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    console.log("📦 PUT PAYLOAD RECEIVED:", JSON.stringify(body));

    if (!body || !Array.isArray(body.projects)) {
      console.log("🚨 PUT FAILURE: Payload is missing the 'projects' array block!");
      return NextResponse.json({ ok: false, error: "Invalid array payload structure" }, { status: 400 });
    }

    const projects = await updateProjects(body.projects);
    console.log("✅ PUT SUCCESS: Database pipeline updated completely. New count:", projects?.length);
    return NextResponse.json({ ok: true, projects });
  } catch (err: any) {
    console.error("🚨 DATABASE OPERATION CRASHED:", err.message);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}