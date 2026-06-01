import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serviceSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";

// GET /api/services — list all services (public: active only, admin: all)
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const isAdmin = !!session?.user;
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const where: Record<string, unknown> = {};
    if (!isAdmin) where.isActive = true;
    if (category) where.category = category;

    const services = await prisma.service.findMany({
      where,
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error("GET /api/services error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// POST /api/services — create a new service (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = serviceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({ data: parsed.data });
    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/services error:", error);
    const message =
      error instanceof Error && error.message.includes("Unique")
        ? "A service with this slug already exists"
        : "Failed to create service";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
