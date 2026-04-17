import { NextRequest, NextResponse } from 'next/server';

const FLYAI_PROXY_URL = process.env.FLYAI_PROXY_URL || 'https://outline-dsc-ethics-kid.trycloudflare.com';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const depDate = searchParams.get('depDate');

  if (!origin) {
    return NextResponse.json({ error: 'Missing origin parameter' }, { status: 400 });
  }

  try {
    const params = new URLSearchParams({ origin });
    if (destination) params.set('destination', destination);
    if (depDate) params.set('depDate', depDate);

    const res = await fetch(`${FLYAI_PROXY_URL}/train?${params}`, { signal: AbortSignal.timeout(30000) });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Train search failed' }, { status: 500 });
  }
}
