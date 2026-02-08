import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy to the FastAPI backend to avoid browser CORS issues.
 *
 * Configure backend URL via:
 * - COSMOS_AI_URL (preferred, server-only)
 * - NEXT_PUBLIC_COSMOS_AI_URL (fallback)
 * - default: Render deployment URL (override to localhost for local dev)
 */
const DEFAULT_BASE_URL = 'https://cosmos-ai-f002.onrender.com';
const BASE_URL = (process.env.COSMOS_AI_URL || process.env.NEXT_PUBLIC_COSMOS_AI_URL || DEFAULT_BASE_URL).replace(/\/$/, '');

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(input: string, init: RequestInit, attempts = 3) {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(input, init);

      // Render free tier can briefly return a routing 404 during cold start.
      // Retrying for a couple seconds avoids a bad UX in the frontend.
      const renderRouting = res.headers.get('x-render-routing');
      if (res.status === 404 && (renderRouting === 'no-server' || renderRouting === 'no-server-available')) {
        await sleep(900 + i * 700);
        continue;
      }

      return res;
    } catch (e) {
      lastErr = e;
      await sleep(900 + i * 700);
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('Upstream request failed');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const upstream = await fetchWithRetry(`${BASE_URL}/api/widgets/recommendations`, {
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

