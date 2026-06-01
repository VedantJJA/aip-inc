import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { settingsUpdateSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";

// GET /api/settings — get all settings (public)
export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany({
      orderBy: { group: "asc" },
    });

    // Convert to a key-value map for easy consumption
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return NextResponse.json({
      success: true,
      data: { settings, settingsMap },
    });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT /api/settings — update settings (admin only)
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = settingsUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    // Update each setting
    const updates = parsed.data.settings.map((setting) =>
      prisma.siteSetting.update({
        where: { key: setting.key },
        data: { value: setting.value },
      })
    );

    await Promise.all(updates);

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error("PUT /api/settings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
