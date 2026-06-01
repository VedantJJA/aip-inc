import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { quoteRequestSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";

// GET /api/quotes — list all quotes (admin only)
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const quotes = await prisma.quoteRequest.findMany({
      include: { service: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: quotes });
  } catch (error) {
    console.error("GET /api/quotes error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch quotes" },
      { status: 500 }
    );
  }
}

// POST /api/quotes — submit a new quote request (public)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = quoteRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    // Verify the service exists
    const service = await prisma.service.findUnique({
      where: { id: parsed.data.serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { success: false, error: "Selected service not found" },
        { status: 400 }
      );
    }

    const quote = await prisma.quoteRequest.create({ data: parsed.data });
    return NextResponse.json({ success: true, data: quote }, { status: 201 });
  } catch (error) {
    console.error("POST /api/quotes error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit quote request" },
      { status: 500 }
    );
  }
}
