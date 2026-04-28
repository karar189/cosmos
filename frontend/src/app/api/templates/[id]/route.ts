import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { DB_UNAVAILABLE_MESSAGE, isPrismaConnectionError } from "@/lib/prisma-errors";

function isValidStellarAddress(addr: string): boolean {
  const s = (addr || "").trim();
  return s.length === 56 && s.startsWith("G");
}

async function resolveBusinessIdByWallet(walletAddress: string): Promise<string | null> {
  const business = await db.business.findUnique({
    where: { walletAddress },
    select: { id: true },
  });
  return business?.id ?? null;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get("walletAddress")?.trim() ?? "";
    if (!walletAddress || !isValidStellarAddress(walletAddress)) {
      return NextResponse.json(
        { error: "walletAddress query required (Stellar G..., 56 chars)" },
        { status: 400 }
      );
    }

    const businessId = await resolveBusinessIdByWallet(walletAddress);
    if (!businessId) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    const template = await db.businessTemplate.findFirst({
      where: { id, businessId },
    });
    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    return NextResponse.json({
      template: {
        id: template.id,
        name: template.name,
        businessName: template.businessName ?? null,
        savedAt: template.updatedAt.toISOString(),
        bundleId: template.bundleId,
        bundleName: template.bundleName,
        description: template.description ?? null,
        widgets: Array.isArray(template.widgets) ? template.widgets : [],
      },
    });
  } catch (e) {
    if (isPrismaConnectionError(e)) {
      return NextResponse.json({ error: DB_UNAVAILABLE_MESSAGE }, { status: 503 });
    }
    console.error("Template GET error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json().catch(() => ({}));
    const walletAddress = typeof body.walletAddress === "string" ? body.walletAddress.trim() : "";
    if (!walletAddress || !isValidStellarAddress(walletAddress)) {
      return NextResponse.json(
        { error: "walletAddress required (Stellar G..., 56 chars)" },
        { status: 400 }
      );
    }

    const businessId = await resolveBusinessIdByWallet(walletAddress);
    if (!businessId) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    const existing = await db.businessTemplate.findFirst({
      where: { id, businessId },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    const update: {
      name?: string;
      description?: string | null;
      widgets?: object;
    } = {};
    if (typeof body.name === "string") {
      const trimmed = body.name.trim();
      if (trimmed) update.name = trimmed;
    }
    if (body.description !== undefined) {
      update.description =
        typeof body.description === "string" ? body.description.trim() || null : null;
    }
    if (Array.isArray(body.widgets)) {
      update.widgets = body.widgets as object;
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const template = await db.businessTemplate.update({
      where: { id: existing.id },
      data: update,
    });

    return NextResponse.json({
      template: {
        id: template.id,
        name: template.name,
        businessName: template.businessName ?? null,
        savedAt: template.updatedAt.toISOString(),
        bundleId: template.bundleId,
        bundleName: template.bundleName,
        description: template.description ?? null,
        widgets: Array.isArray(template.widgets) ? template.widgets : [],
      },
    });
  } catch (e) {
    if (isPrismaConnectionError(e)) {
      return NextResponse.json({ error: DB_UNAVAILABLE_MESSAGE }, { status: 503 });
    }
    console.error("Template PATCH error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
