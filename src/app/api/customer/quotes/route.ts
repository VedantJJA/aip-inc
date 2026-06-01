import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { customerAuth } from "@/lib/customer-auth";

// GET /api/customer/quotes — list all quotes for authenticated customer
export async function GET() {
  try {
    const session = await customerAuth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const quotes = await prisma.quoteRequest.findMany({
      where: { customerId: session.user.id },
      include: {
        service: { select: { title: true, slug: true, iconName: true } },
        assignedTeam: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: quotes });
  } catch (error) {
    console.error("GET /api/customer/quotes error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
