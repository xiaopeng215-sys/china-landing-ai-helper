import { trackEvent, type EventType } from '@/lib/analytics/events';

export function useAnalytics() {
  const track = (type: EventType, properties: Record<string, unknown> = {}) =>
    trackEvent(type, properties);
  return { track };
}
