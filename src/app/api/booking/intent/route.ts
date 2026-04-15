import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

export interface BookingIntentPayload {
  user_id?: string;
  place_name: string;
  place_type?: string;
  check_in?: string;
  check_out?: string;
  adults?: number;
  email?: string;
  affiliate_url?: string;
}

// POST /api/booking/intent — record a booking intent
export async function POST(req: NextRequest) {
  try {
    const body: BookingIntentPayload = await req.json();

    if (!body.place_name) {
      return NextResponse.json({ error: 'place_name is required' }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('booking_intents')
      .insert({
        user_id: body.user_id ?? null,
        place_name: body.place_name,
        place_type: body.place_type ?? null,
        check_in: body.check_in ?? null,
        check_out: body.check_out ?? null,
        adults: body.adults ?? 1,
        email: body.email ?? null,
        affiliate_url: body.affiliate_url ?? null,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[booking/intent] insert error:', error);
      // Don't block the user — log and continue
      return NextResponse.json({ ok: true, id: null });
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch (err) {
    console.error('[booking/intent] unexpected error:', err);
    return NextResponse.json({ ok: true, id: null }); // fail-open
  }
}

// GET /api/booking/intent?user_id=xxx — fetch booking history
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('user_id');
  if (!userId) {
    return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('booking_intents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[booking/intent] query error:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }

  return NextResponse.json({ intents: data });
}
