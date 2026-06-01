import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.team.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Team group deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/teams/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete team group" }, { status: 500 });
  }
}
