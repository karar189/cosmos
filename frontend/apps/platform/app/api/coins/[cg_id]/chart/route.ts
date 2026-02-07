import { COINGECKO_API_ROUTES } from '@/constants/api';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cg_id: string }> }
) {
  try {
    const { cg_id: symbol } = await params;
    const searchParams = request.nextUrl.searchParams;
    const queries = new URLSearchParams(searchParams);

    // Call CoinGecko from the server-side API route
    const response = await fetch(COINGECKO_API_ROUTES.TOKEN_CHART(symbol, queries.toString()),
      {
        headers: {
          'x-cg-pro-api-key': process.env.COINGECKO_API_KEY || '',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `CoinGecko API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}