import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { rating, message, page, userId } = body;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error } = await supabase.from('feedback').insert({
        rating,
        message,
        page: page || '/',
        user_id: userId || null,
        created_at: new Date().toISOString(),
      });
      if (error) {
        console.error('[feedback] supabase insert error:', error.message);
      }
    } catch (err) {
      console.error('[feedback] unexpected error:', err);
    }
  } else {
    // Fallback: log to console when Supabase is not configured
    console.log('[feedback]', { rating, message, page, userId, ts: new Date().toISOString() });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
