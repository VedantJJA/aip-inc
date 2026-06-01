import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Explicitly stripping adminNotes and internal PII
    const quote = await prisma.quoteRequest.findUnique({
      where: { id },
      select: {
        id: true,
        clientName: true,
        projectDetails: true,
        budget: true,
        timeline: true,
        status: true,
        currentMilestone: true,
        progressPercent: true,
        createdAt: true,
        service: { select: { title: true } },
        assignedTeam: { select: { name: true } }
      },
    });

    if (!quote) {
      return NextResponse.json({ success: false, error: "Quote tracking id not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: quote });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to track quote" }, { status: 500 });
  }
}
