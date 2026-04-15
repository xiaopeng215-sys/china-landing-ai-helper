import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createClient } from '@supabase/supabase-js';

function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? '';
  return raw.split(',').map((e) => e.trim()).filter(Boolean);
}

function supabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function GET() {
  // Auth check
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!getAdminEmails().includes(session.user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const db = supabase();
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  // 1. DAU — distinct users who triggered an event today
  const { count: dau } = await db
    .from('analytics_events')
    .select('user_id', { count: 'exact', head: true })
    .gte('created_at', `${today}T00:00:00.000Z`)
    .lt('created_at', `${today}T23:59:59.999Z`);

  // 2. Total registered users
  const { count: totalUsers } = await db
    .from('user_profiles')
    .select('user_id', { count: 'exact', head: true });

  // 3. Total events
  const { count: totalEvents } = await db
    .from('analytics_events')
    .select('id', { count: 'exact', head: true });

  // 4. Top 5 events by type
  const { data: rawTopEvents } = await db
    .from('analytics_events')
    .select('event_type')
    .order('created_at', { ascending: false })
    .limit(10000); // aggregate client-side (Supabase free tier has no GROUP BY RPC by default)

  const eventCounts: Record<string, number> = {};
  for (const row of rawTopEvents ?? []) {
    eventCounts[row.event_type] = (eventCounts[row.event_type] ?? 0) + 1;
  }
  const topEvents = Object.entries(eventCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([type, count]) => ({ type, count }));

  // 5. Daily active users — last 7 days
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }

  const dailyActiveUsers: { date: string; count: number }[] = [];
  for (const date of days) {
    const { count } = await db
      .from('analytics_events')
      .select('user_id', { count: 'exact', head: true })
      .gte('created_at', `${date}T00:00:00.000Z`)
      .lt('created_at', `${date}T23:59:59.999Z`);
    dailyActiveUsers.push({ date, count: count ?? 0 });
  }

  // 6. Conversion rate: click_booking / view_hotel
  const { count: clickBooking } = await db
    .from('analytics_events')
    .select('id', { count: 'exact', head: true })
    .eq('event_type', 'click_booking');

  const { count: viewHotel } = await db
    .from('analytics_events')
    .select('id', { count: 'exact', head: true })
    .eq('event_type', 'view_hotel');

  const conversionRate =
    viewHotel && viewHotel > 0
      ? Math.round(((clickBooking ?? 0) / viewHotel) * 10000) / 100
      : 0;

  return NextResponse.json({
    dau: dau ?? 0,
    totalUsers: totalUsers ?? 0,
    totalEvents: totalEvents ?? 0,
    topEvents,
    dailyActiveUsers,
    conversionRate,
  });
}
