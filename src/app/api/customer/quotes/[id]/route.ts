import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/customer/quotes/[id] — get a single quote (only if owned by customer)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "CUSTOMER") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const quote = await prisma.quoteRequest.findUnique({
      where: { id },
      include: {
        service: { select: { title: true, slug: true, iconName: true } },
        assignedTeam: { select: { name: true } },
        assignedTo: { select: { name: true } },
      },
    });

    if (!quote || quote.customerId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Strip admin-only fields
    const { adminNotes, ...safeQuote } = quote;
    return NextResponse.json({ success: true, data: safeQuote });
  } catch (error) {
    console.error("GET /api/customer/quotes/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}
