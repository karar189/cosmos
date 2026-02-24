import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { isPrismaConnectionError, DB_UNAVAILABLE_MESSAGE } from "@/lib/prisma-errors";

/** GET /api/vault?businessId=... | ?walletAddress=... — list Document vault items. */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let businessId = searchParams.get("businessId")?.trim();
    const walletAddress = searchParams.get("walletAddress")?.trim();
    if (!businessId && walletAddress) {
      const b = await db.business.findUnique({
        where: { walletAddress },
        select: { id: true },
      });
      if (b) businessId = b.id;
    }
    if (!businessId) {
      return NextResponse.json({ error: "businessId or walletAddress required" }, { status: 400 });
    }
    const items = await db.documentVaultItem.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" },
      select: { id: true, type: true, title: true, itemsJson: true, createdAt: true },
    });
    const parsed = items.map((i) => ({
      id: i.id,
      type: i.type,
      title: i.title,
      items: (() => {
        try {
          return JSON.parse(i.itemsJson) as { id: string; text: string; done: boolean }[];
        } catch {
          return [];
        }
      })(),
      createdAt: i.createdAt.toISOString(),
    }));
    return NextResponse.json({ items: parsed });
  } catch (e) {
    if (isPrismaConnectionError(e)) {
      console.warn("Vault GET: database unavailable");
      return NextResponse.json({ error: DB_UNAVAILABLE_MESSAGE }, { status: 503 });
    }
    console.error("Vault list error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** POST /api/vault — save a checklist to Document vault. Body: { businessId?: string, walletAddress?: string, title?: string, items: [{ id, text, done }] } */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    let businessId = (body.businessId ?? "").trim();
    const walletAddress = (body.walletAddress ?? "").trim();
    const title = (body.title ?? "Compliance checklist").trim();
    const rawItems = Array.isArray(body.items) ? body.items : [];
    if (!businessId && walletAddress) {
      const b = await db.business.findUnique({
        where: { walletAddress },
        select: { id: true },
      });
      if (b) businessId = b.id;
    }
    if (!businessId) {
      return NextResponse.json({ error: "businessId or walletAddress required" }, { status: 400 });
    }

    const business = await db.business.findUnique({ where: { id: businessId } });
    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const items = rawItems.map((x: { id?: string; text?: string; done?: boolean }) => ({
      id: typeof x.id === "string" ? x.id : `item-${Math.random().toString(36).slice(2, 9)}`,
      text: typeof x.text === "string" ? x.text : String(x),
      done: Boolean(x.done),
    }));

    const vault = await db.documentVaultItem.create({
      data: {
        businessId,
        type: "compliance_checklist",
        title: title || "Regulatory & compliance checklist",
        itemsJson: JSON.stringify(items),
      },
    });

    return NextResponse.json({
      id: vault.id,
      title: vault.title,
      createdAt: vault.createdAt.toISOString(),
    });
  } catch (e) {
    if (isPrismaConnectionError(e)) {
      console.warn("Vault POST: database unavailable");
      return NextResponse.json({ error: DB_UNAVAILABLE_MESSAGE }, { status: 503 });
    }
    console.error("Vault save error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
