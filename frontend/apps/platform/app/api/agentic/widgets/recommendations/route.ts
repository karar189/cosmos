import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy to the FastAPI backend to avoid browser CORS issues.
 *
 * Configure backend URL via:
 * - COSMOS_AI_URL (preferred, server-only)
 * - NEXT_PUBLIC_COSMOS_AI_URL (fallback)
 * - default: http://localhost:8001
 */
const BASE_URL = (process.env.COSMOS_AI_URL || process.env.NEXT_PUBLIC_COSMOS_AI_URL || 'http://localhost:8001').replace(
  /\/$/,
  ''
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const upstream = await fetch(`${BASE_URL}/api/widgets/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      // no-store so we don't cache recommendations
      cache: 'no-store',
    });

    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('content-type') || 'application/json',
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Proxy error' },
      { status: 500 }
    );
  }
}

