import { NextRequest, NextResponse } from "next/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

/** Stateless: build payment link URL from body. No database. */
export async function POST(req: NextRequest) {
  try {
    const { amount, memo, creatorPublicKey, destinationAddress } = await req.json();
    if (!amount) {
      return NextResponse.json({ error: "amount required" }, { status: 400 });
    }
    if (!creatorPublicKey || typeof creatorPublicKey !== "string") {
      return NextResponse.json({ error: "creatorPublicKey required" }, { status: 400 });
    }
    const destination = (destinationAddress && destinationAddress.trim()) || creatorPublicKey;
    const id = `pl_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const params = new URLSearchParams();
    params.set("amount", String(amount).trim());
    if (memo && String(memo).trim()) params.set("memo", String(memo).trim());
    params.set("dest", destination);
    const url = `${BASE_URL}/pay/${id}?${params.toString()}`;
    return NextResponse.json({ url, id });
  } catch (e) {
    console.error("Payment link create error:", e);
    return NextResponse.json({ error: "Invalid request" }, { status: 500 });
  }
}

/** No storage: return empty list. */
export async function GET() {
  return NextResponse.json({ links: [] });
}
