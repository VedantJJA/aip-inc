import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone, company } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if customer already exists
    const existing = await prisma.customer.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        passwordHash,
        phone: phone || null,
        company: company || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: { id: customer.id, name: customer.name, email: customer.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/customer/register error:", error);
    return NextResponse.json(
      { success: false, error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
