import { NextRequest, NextResponse } from "next/server";
import { proxyRegintel } from "../../proxy";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ profileId: string }> }
) {
  const { profileId } = await params;
  const res = await proxyRegintel(`/api/regintel/profile/${profileId}`, { method: "GET" });
  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") || "application/json" },
  });
}
