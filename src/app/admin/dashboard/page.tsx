import { redirect } from 'next/navigation';
import { auth } from '@/auth';

function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? '';
  return raw.split(',').map((e) => e.trim()).filter(Boolean);
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatsData {
  dau: number;
  totalUsers: number;
  totalEvents: number;
  topEvents: { type: string; count: number }[];
  dailyActiveUsers: { date: string; count: number }[];
  conversionRate: number;
}

// ─── Server Component ─────────────────────────────────────────────────────────

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/auth/signin?callbackUrl=/admin/dashboard');
  }

  if (!getAdminEmails().includes(session.user.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">403 Forbidden</h1>
          <p className="text-gray-500">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // Fetch stats server-side
  let stats: StatsData | null = null;
  let error: string | null = null;

  try {
    const baseUrl = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/admin/stats`, {
      headers: {
        // Pass the session cookie so the API route can auth
        Cookie: `next-auth.session-token=${(session as any)?.sessionToken ?? ''}`,
      },
      cache: 'no-store',
    });
    if (res.ok) {
      stats = await res.json();
    } else {
      error = `API error: ${res.status}`;
    }
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load stats';
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">TravelerLocal.ai · Internal Analytics</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {stats && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard label="DAU" value={stats.dau} />
              <StatCard label="Total Users" value={stats.totalUsers} />
              <StatCard label="Total Events" value={stats.totalEvents} />
              <StatCard label="Conversion Rate" value={`${stats.conversionRate}%`} />
            </div>

            {/* DAU Chart + Top Events */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DauChart data={stats.dailyActiveUsers} />
              <TopEventsList events={stats.topEvents} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function DauChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">Daily Active Users (7d)</h2>
      <div className="flex items-end gap-2 h-32">
        {data.map((d) => {
          const heightPct = Math.round((d.count / max) * 100);
          const label = d.date.slice(5); // MM-DD
          return (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500">{d.count}</span>
              <div
                className="w-full bg-indigo-500 rounded-t"
                style={{ height: `${Math.max(heightPct, 2)}%` }}
                title={`${d.date}: ${d.count}`}
              />
              <span className="text-xs text-gray-400 rotate-0">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TopEventsList({ events }: { events: { type: string; count: number }[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">Top Events (Top 5)</h2>
      {events.length === 0 ? (
        <p className="text-sm text-gray-400">No events yet.</p>
      ) : (
        <ol className="space-y-3">
          {events.map((e, i) => (
            <li key={e.type} className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <span className="flex-1 text-sm text-gray-700 font-mono truncate">{e.type}</span>
              <span className="text-sm font-semibold text-gray-900">{e.count.toLocaleString()}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
