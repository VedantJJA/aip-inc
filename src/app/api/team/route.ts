import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const team = await prisma.teamMember.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: team });
  } catch (error) {
    console.error("GET /api/team error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch team members" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, role, email, teamId } = body;

    if (!name || !role) {
      return NextResponse.json({ success: false, error: "Name and role are required" }, { status: 400 });
    }

    const member = await prisma.teamMember.create({
      data: { name, role, email, teamId: teamId || null },
    });
    return NextResponse.json({ success: true, data: member }, { status: 201 });
  } catch (error) {
    console.error("POST /api/team error:", error);
    return NextResponse.json({ success: false, error: "Failed to add team member" }, { status: 500 });
  }
}
