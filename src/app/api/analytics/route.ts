import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { AnalyticsEvent } from '@/lib/analytics/events';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const events: AnalyticsEvent[] = Array.isArray(body.events) ? body.events : [body];

    // max 50 per batch
    const batch = events.slice(0, 50).map((e) => ({
      type: e.type,
      user_id: e.userId ?? null,
      session_id: e.sessionId,
      properties: e.properties ?? {},
    }));

    const supabase = getSupabase();
    const { error } = await supabase.from('analytics_events').insert(batch);

    if (error) {
      console.error('[analytics] insert error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, count: batch.length });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'unknown error';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
