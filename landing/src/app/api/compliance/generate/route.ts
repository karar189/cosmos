import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

function isValidStellarAddress(addr: string): boolean {
  const s = (addr || "").trim();
  return s.length === 56 && s.startsWith("G");
}

/**
 * POST /api/compliance/generate
 * Body: { walletAddress: string }
 * Uses OpenAI to generate a regulatory & compliance checklist for the business.
 * Returns { items: { id: string, text: string }[] }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const walletAddress = (body.walletAddress ?? "").trim();
    if (!walletAddress || !isValidStellarAddress(walletAddress)) {
      return NextResponse.json(
        { error: "Valid walletAddress (Stellar G...) required" },
        { status: 400 }
      );
    }

    const business = await db.business.findUnique({
      where: { walletAddress },
      select: { id: true, name: true, email: true, businessNature: true },
    });

    const profile = business ?? {
      id: "",
      name: null,
      email: null,
      businessNature: null,
    };
    const name = profile.name || "Your business";
    const nature = profile.businessNature || "general business";
    const email = profile.email ? ` (contact: ${profile.email})` : "";

    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY not configured. Set it in .env to generate compliance checklists." },
        { status: 503 }
      );
    }

    const systemPrompt = `You are a regulatory and compliance advisor. Given a business profile, produce a concise checklist of regulatory and compliance actions the business should take to operate in a legally compliant manner. Output only a JSON array of strings, each string being one actionable item (e.g. "Register for data protection authority if processing EU personal data"). No other text. Example: ["Item one", "Item two"]`;
    const userPrompt = `Business: ${name}${email}. Nature: ${nature}. Generate a professional, actionable regulatory and compliance checklist (8–15 items) for this business to become fully legally compliant. Return only a JSON array of strings.`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.4,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("OpenAI error:", res.status, err);
      return NextResponse.json(
        { error: "Failed to generate checklist. Please try again." },
        { status: 502 }
      );
    }

    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content?.trim() ?? "";
    let list: string[] = [];
    try {
      const parsed = JSON.parse(content) as unknown;
      list = Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
    } catch {
      const lines = content.split("\n").map((s) => s.replace(/^[-*]\s*/, "").trim()).filter(Boolean);
      list = lines.slice(0, 20);
    }

    const items = list.slice(0, 20).map((text, i) => ({
      id: `item-${Date.now()}-${i}`,
      text,
    }));

    return NextResponse.json({ items });
  } catch (e) {
    console.error("Compliance generate error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
