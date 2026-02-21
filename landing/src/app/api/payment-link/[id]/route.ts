import { NextRequest, NextResponse } from "next/server";

/** No storage: payment links are URL-only. Return 404. */
export async function GET(
  _req: NextRequest,
  _context: { params: Promise<{ id: string }> }
) {
  return NextResponse.json({ error: "Payment link not found" }, { status: 404 });
}
