import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const teams = await prisma.team.findMany({
      orderBy: { createdAt: "desc" },
      include: { members: true },
    });

    return NextResponse.json({ success: true, data: teams });
  } catch (error) {
    console.error("GET /api/teams error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch teams" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }

    const team = await prisma.team.create({
      data: { name, description },
      include: { members: true },
    });
    return NextResponse.json({ success: true, data: team }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("POST /api/teams error:", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
