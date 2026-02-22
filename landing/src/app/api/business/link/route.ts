import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

/** Stellar public keys are G..., 56 chars. */
function isValidStellarAddress(addr: string): boolean {
  const s = addr.trim();
  return s.length === 56 && s.startsWith("G");
}

/** Get or create a business by wallet address. Optional body: receiveAddress (Stellar G...). Returns { businessId, receiveAddress }. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const walletAddress = body.walletAddress;
    const receiveAddress = body.receiveAddress;
    const address = typeof walletAddress === "string" ? walletAddress.trim() : "";
    if (!address || !isValidStellarAddress(address)) {
      return NextResponse.json(
        { error: "walletAddress required (Stellar G... address, 56 characters)" },
        { status: 400 }
      );
    }

    let business = await db.business.findUnique({
      where: { walletAddress: address },
    });
    const receiveTrimmed = typeof receiveAddress === "string" ? receiveAddress.trim() : "";
    if (receiveTrimmed && !isValidStellarAddress(receiveTrimmed)) {
      return NextResponse.json(
        { error: "receiveAddress must be a valid Stellar address (starts with G, 56 characters)" },
        { status: 400 }
      );
    }
    if (!business) {
      business = await db.business.create({
        data: {
          walletAddress: address,
          receiveAddress: receiveTrimmed.length === 56 ? receiveTrimmed : undefined,
        },
      });
    } else if (receiveTrimmed.length === 56) {
      business = await db.business.update({
        where: { id: business.id },
        data: { receiveAddress: receiveTrimmed },
      });
    }
    return NextResponse.json({
      businessId: business.id,
      receiveAddress: business.receiveAddress ?? null,
    });
  } catch (e) {
    console.error("Business link error:", e);
    const message =
      process.env.NODE_ENV === "development" && e instanceof Error
        ? e.message
        : "Database error. Check DATABASE_URL, run: npx prisma generate (and npx prisma db push if using SQL).";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** Update receive address for the business identified by wallet. Body: { walletAddress, receiveAddress }. */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const walletAddress = body.walletAddress;
    const receiveAddress = body.receiveAddress;
    const address = typeof walletAddress === "string" ? walletAddress.trim() : "";
    if (!address || !isValidStellarAddress(address)) {
      return NextResponse.json(
        { error: "walletAddress required (Stellar G... address, 56 characters)" },
        { status: 400 }
      );
    }
    const g = typeof receiveAddress === "string" ? receiveAddress.trim() : "";
    if (!g || !isValidStellarAddress(g)) {
      return NextResponse.json(
        { error: "receiveAddress must be a valid Stellar address (starts with G, 56 characters)" },
        { status: 400 }
      );
    }

    const business = await db.business.findUnique({ where: { walletAddress: address } });
    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }
    const updated = await db.business.update({
      where: { id: business.id },
      data: { receiveAddress: g },
    });
    return NextResponse.json({ businessId: updated.id, receiveAddress: updated.receiveAddress });
  } catch (e) {
    console.error("Business PATCH error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
