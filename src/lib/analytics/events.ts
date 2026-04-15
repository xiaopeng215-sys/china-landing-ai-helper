export type EventType =
  | 'view_attraction'
  | 'view_hotel'
  | 'view_food'
  | 'click_booking'
  | 'save_itinerary'
  | 'share_content'
  | 'search_query'
  | 'chat_message'
  | 'complete_onboarding';

export interface AnalyticsEvent {
  type: EventType;
  userId?: string;
  sessionId: string;
  properties: Record<string, unknown>;
  timestamp: number;
}

const SESSION_KEY = 'tl_session_id';
const CACHE_KEY = 'tl_analytics_cache';
const MAX_CACHE = 100;

function getSessionId(): string {
  if (typeof window === 'undefined') return 'ssr';
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function cacheEvent(event: AnalyticsEvent): void {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const cache: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
    cache.push(event);
    // keep last MAX_CACHE events
    if (cache.length > MAX_CACHE) cache.splice(0, cache.length - MAX_CACHE);
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // localStorage unavailable — ignore
  }
}

export function trackEvent(type: EventType, properties: Record<string, unknown> = {}): void {
  const event: AnalyticsEvent = {
    type,
    sessionId: getSessionId(),
    properties,
    timestamp: Date.now(),
  };

  // 1. Local cache (best-effort)
  cacheEvent(event);

  // 2. Fire-and-forget to API
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events: [event] }),
  }).catch(() => {});
}
