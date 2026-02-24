import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

const PRODUCTION_BASE = "https://www.hypertron.space";
const rawBase =
  process.env.NEXT_PUBLIC_APP_URL?.trim() ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
const isProductionOrMain =
  process.env.NODE_ENV === "production" || process.env.VERCEL_GIT_COMMIT_REF === "main";
const BASE_URL =
  isProductionOrMain && (!rawBase || rawBase.includes("localhost"))
    ? PRODUCTION_BASE
    : rawBase;

/** Pool address where payment-link funds are sent. When set, all links pay here (business.receiveAddress is for withdraws only). */
const PAYMENT_POOL_ADDRESS = (
  process.env.NEXT_PUBLIC_PAYMENT_POOL_ADDRESS?.trim() ||
  process.env.NEXT_PUBLIC_MERCHANT_RECIPIENT?.trim() ||
  ""
).trim();
const FALLBACK_RECIPIENT = process.env.NEXT_PUBLIC_MERCHANT_RECIPIENT?.trim() || "";

function generateLinkMemo(): string {
  return "hpl_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 10);
}

/** Create a payment link (DB). Destination: pool address if set, else business.receiveAddress, else NEXT_PUBLIC_MERCHANT_RECIPIENT. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      businessId,
      amount,
      purpose,
      clientName,
      workflowStage,
      flexibleAmount,
    } = body;

    const bid = typeof businessId === "string" ? businessId.trim() : "";
    const isFlexible = flexibleAmount === true || flexibleAmount === "true";
    const amt = isFlexible ? "" : (typeof amount === "string" ? amount.trim() : String(amount ?? "").trim());
    if (!bid) {
      return NextResponse.json({ error: "businessId required" }, { status: 400 });
    }
    if (!isFlexible && !amt) {
      return NextResponse.json({ error: "amount required (or set flexibleAmount: true for pay-any-amount link)" }, { status: 400 });
    }

    const business = await db.business.findUnique({ where: { id: bid } });
    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    // Prefer pool so funds go to pool; business.receiveAddress is used for withdraws, not as payment destination when pool is set.
    const destinationAddress = (
      PAYMENT_POOL_ADDRESS ||
      (business.receiveAddress ?? FALLBACK_RECIPIENT)
    ).trim();
    if (!destinationAddress) {
      return NextResponse.json(
        {
          error:
            "Set NEXT_PUBLIC_PAYMENT_POOL_ADDRESS (or NEXT_PUBLIC_MERCHANT_RECIPIENT) in .env so payments go to the pool, or set Receive address in the dashboard for direct receive.",
        },
        { status: 400 }
      );
    }

    let linkMemo = generateLinkMemo();
    while (await db.paymentLink.findUnique({ where: { linkMemo } })) {
      linkMemo = generateLinkMemo();
    }

    const link = await db.paymentLink.create({
      data: {
        businessId: bid,
        amount: amt || "",
        purpose: purpose ? String(purpose).trim() : null,
        clientName: clientName ? String(clientName).trim() : null,
        workflowStage: workflowStage ? String(workflowStage).trim() : null,
        linkMemo,
        destinationAddress,
      },
    });

    const url = `${BASE_URL}/pay/${link.id}`;
    const qrPayload = url;

    return NextResponse.json({
      linkId: link.id,
      url,
      qrPayload,
      memo: link.linkMemo,
      amount: link.amount,
      destinationAddress: link.destinationAddress,
    });
  } catch (e) {
    console.error("Payment link create error:", e);
    return NextResponse.json(
      { error: "Database error. Check DATABASE_URL and run: npx prisma db push" },
      { status: 500 }
    );
  }
}

/** List payment links for a business. Query: businessId (required). */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");
    if (!businessId) {
      return NextResponse.json({ error: "businessId query required" }, { status: 400 });
    }

    const links = await db.paymentLink.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        amount: true,
        purpose: true,
        clientName: true,
        workflowStage: true,
        linkMemo: true,
        paidAt: true,
        paymentTxHash: true,
        commitmentTxHash: true,
        createdAt: true,
      },
    });

    const baseUrl = BASE_URL;
    return NextResponse.json({
      links: links.map((l) => ({
        ...l,
        url: `${baseUrl}/pay/${l.id}`,
      })),
    });
  } catch (e) {
    console.error("Payment link list error:", e);
    const message =
      process.env.NODE_ENV === "development" && e instanceof Error
        ? e.message
        : "Server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
