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

export async function GET(req: NextRequest) {
  try {
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
      return NextResponse.json({ templates: [] });
    }

    const templates = await db.businessTemplate.findMany({
      where: { businessId },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      templates: templates.map((t) => ({
        id: t.id,
        name: t.name,
        businessName: t.businessName ?? null,
        savedAt: t.updatedAt.toISOString(),
        bundleId: t.bundleId,
        bundleName: t.bundleName,
        description: t.description ?? null,
        widgets: Array.isArray(t.widgets) ? t.widgets : [],
      })),
    });
  } catch (e) {
    if (isPrismaConnectionError(e)) {
      return NextResponse.json({ error: DB_UNAVAILABLE_MESSAGE }, { status: 503 });
    }
    console.error("Templates GET error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const walletAddress = typeof body.walletAddress === "string" ? body.walletAddress.trim() : "";
    if (!walletAddress || !isValidStellarAddress(walletAddress)) {
      return NextResponse.json(
        { error: "walletAddress required (Stellar G..., 56 chars)" },
        { status: 400 }
      );
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const bundleId = typeof body.bundleId === "string" ? body.bundleId.trim() : "";
    const bundleName = typeof body.bundleName === "string" ? body.bundleName.trim() : "";
    if (!name || !bundleId || !bundleName) {
      return NextResponse.json(
        { error: "name, bundleId, and bundleName are required" },
        { status: 400 }
      );
    }

    const business = await db.business.findUnique({
      where: { walletAddress },
      select: { id: true },
    });
    if (!business) {
      return NextResponse.json({ error: "Business profile not found" }, { status: 404 });
    }

    const template = await db.businessTemplate.create({
      data: {
        businessId: business.id,
        name,
        bundleId,
        bundleName,
        businessName:
          typeof body.businessName === "string" ? body.businessName.trim() || null : null,
        description:
          typeof body.description === "string" ? body.description.trim() || null : null,
        widgets: Array.isArray(body.widgets) ? (body.widgets as object) : [],
      },
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
    console.error("Templates POST error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
