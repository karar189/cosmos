import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

function isValidStellarAddress(addr: string): boolean {
  const s = (addr || "").trim();
  return s.length === 56 && s.startsWith("G");
}

/**
 * GET /api/business/profile?walletAddress=G...
 * Returns profile for the business identified by wallet (name, email, businessNature, selectedWidgets).
 * Wallet = identity; no password. Ensures business exists (creates if needed) so caller can rely on profile.
 */
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

    let business = await db.business.findUnique({
      where: { walletAddress: walletAddress },
      select: {
        id: true,
        name: true,
        email: true,
        businessNature: true,
        selectedWidgets: true,
        receiveAddress: true,
      },
    });

    if (!business) {
      business = await db.business.create({
        data: { walletAddress: walletAddress },
        select: {
          id: true,
          name: true,
          email: true,
          businessNature: true,
          selectedWidgets: true,
          receiveAddress: true,
        },
      });
    }

    return NextResponse.json({
      businessId: business.id,
      name: business.name ?? "",
      email: business.email ?? "",
      businessNature: business.businessNature ?? "",
      selectedWidgets: business.selectedWidgets ?? [],
      receiveAddress: business.receiveAddress ?? null,
    });
  } catch (e) {
    console.error("Business profile GET error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * PATCH /api/business/profile
 * Body: { walletAddress, name?, email?, businessNature?, selectedWidgets? }
 * Updates profile for the business identified by wallet. Creates business if not exists.
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const walletAddress = typeof body.walletAddress === "string" ? body.walletAddress.trim() : "";
    if (!walletAddress || !isValidStellarAddress(walletAddress)) {
      return NextResponse.json(
        { error: "walletAddress required (Stellar G..., 56 chars)" },
        { status: 400 }
      );
    }

    const name = typeof body.name === "string" ? body.name.trim() : undefined;
    const email = typeof body.email === "string" ? body.email.trim() : undefined;
    const businessNature = typeof body.businessNature === "string" ? body.businessNature.trim() : undefined;
    const selectedWidgets = Array.isArray(body.selectedWidgets)
      ? body.selectedWidgets.filter((w: unknown) => typeof w === "string")
      : undefined;

    let business = await db.business.findUnique({
      where: { walletAddress: walletAddress },
    });

    if (!business) {
      business = await db.business.create({
        data: {
          walletAddress: walletAddress,
          ...(name != null && { name: name || null }),
          ...(email != null && { email: email || null }),
          ...(businessNature != null && { businessNature: businessNature || null }),
          ...(selectedWidgets != null && { selectedWidgets: selectedWidgets }),
        },
      });
    } else {
      const update: { name?: string | null; email?: string | null; businessNature?: string | null; selectedWidgets?: string[] } = {};
      if (name !== undefined) update.name = name || null;
      if (email !== undefined) update.email = email || null;
      if (businessNature !== undefined) update.businessNature = businessNature || null;
      if (selectedWidgets !== undefined) update.selectedWidgets = selectedWidgets;
      if (Object.keys(update).length > 0) {
        business = await db.business.update({
          where: { id: business.id },
          data: update,
        });
      }
    }

    return NextResponse.json({
      businessId: business.id,
      name: business.name ?? "",
      email: business.email ?? "",
      businessNature: business.businessNature ?? "",
      selectedWidgets: business.selectedWidgets ?? [],
    });
  } catch (e) {
    console.error("Business profile PATCH error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
