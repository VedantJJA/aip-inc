import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { quoteStatusUpdateSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";

// GET /api/quotes/[id] — get single quote (admin only)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const quote = await prisma.quoteRequest.findUnique({
      where: { id },
      include: { service: true },
    });

    if (!quote) {
      return NextResponse.json(
        { success: false, error: "Quote not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: quote });
  } catch (error) {
    console.error("GET /api/quotes/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch quote" },
      { status: 500 }
    );
  }
}

// PUT /api/quotes/[id] — update quote status/notes (admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = quoteStatusUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const quote = await prisma.quoteRequest.update({
      where: { id },
      data: parsed.data,
      include: { service: true },
    });

    return NextResponse.json({ success: true, data: quote });
  } catch (error) {
    console.error("PUT /api/quotes/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update quote" },
      { status: 500 }
    );
  }
}
