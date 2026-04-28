import { NextRequest, NextResponse } from "next/server";
import { requireSessionWallet } from "@/lib/require-session-wallet";

const DEFAULT_BASE = "http://localhost:8001";
const BASE =
  (process.env.COSMOS_AI_URL || process.env.NEXT_PUBLIC_COSMOS_AI_URL || DEFAULT_BASE).replace(
    /\/$/,
    ""
  );

export async function POST(req: NextRequest) {
  try {
    const session = await requireSessionWallet(req);
    if (session instanceof NextResponse) return session;

    const incoming = await req.formData();
    const outbound = new FormData();

    const companyDetails = String(incoming.get("companyDetails") || "").trim();
    const country = String(incoming.get("country") || "").trim();
    const businessModel = String(incoming.get("businessModel") || "").trim();
    const notes = String(incoming.get("notes") || "").trim();
    const websites = String(incoming.get("websites") || "").trim();

    outbound.append("company_details", companyDetails);
    outbound.append("country", country);
    outbound.append("business_model", businessModel);
    if (notes) outbound.append("notes", notes);
    if (websites) outbound.append("websites", websites);

    const fileEntries = incoming.getAll("files");
    for (const file of fileEntries) {
      if (file instanceof File) {
        outbound.append("files", file, file.name);
      }
    }

    const response = await fetch(`${BASE}/api/compliance-agent/analyze`, {
      method: "POST",
      body: outbound,
      cache: "no-store",
    });

    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Compliance agent proxy error:", error);
    return NextResponse.json(
      {
        error:
          "Could not reach Compliance Agent backend. Ensure ai-analyzer is running on port 8001.",
      },
      { status: 502 }
    );
  }
}
