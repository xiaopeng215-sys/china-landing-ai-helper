/**
 * Affiliate Link Generator
 * TravelerLocal.ai - Booking.com + Klook + Ctrip commission links
 *
 * Revenue targets:
 *   Booking.com: ~4-6% commission on hotel bookings
 *   Klook:       ~5-8% commission on attractions/experiences
 *   Ctrip:       ~3-5% commission on hotels/flights/trains
 */

// ── Booking.com ──────────────────────────────────────────────────────────────

/**
 * City name → Booking.com city ID mapping (top China destinations)
 * Full list: https://www.booking.com/affiliate/
 */
const BOOKING_CITY_IDS: Record<string, string> = {
  beijing: '-2181849',
  shanghai: '-2181856',
  chengdu: '-2181850',
  xian: '-2181858',
  guilin: '-2181851',
  hangzhou: '-2181852',
  guangzhou: '-2181853',
  shenzhen: '-2181857',
  chongqing: '-2181854',
  suzhou: '-2181855',
};

export interface BookingLinkParams {
  city: string;
  checkIn?: string;   // YYYY-MM-DD
  checkOut?: string;  // YYYY-MM-DD
  adults?: number;
}

export function buildBookingLink(params: BookingLinkParams): string {
  const AID = process.env.BOOKING_AFFILIATE_ID || 'demo';
  const base = 'https://www.booking.com/searchresults.html';

  const cityKey = params.city.toLowerCase().replace(/\s+/g, '');
  const cityId = BOOKING_CITY_IDS[cityKey];

  const query = new URLSearchParams({ aid: AID });

  if (cityId) {
    query.set('dest_id', cityId);
    query.set('dest_type', 'city');
  } else {
    query.set('ss', params.city);
  }

  if (params.checkIn) query.set('checkin', params.checkIn);
  if (params.checkOut) query.set('checkout', params.checkOut);
  if (params.adults) query.set('group_adults', String(params.adults));

  // Preferred language for foreign travelers
  query.set('lang', 'en-gb');

  return `${base}?${query.toString()}`;
}

// ── Klook ────────────────────────────────────────────────────────────────────

const KLOOK_CITY_SLUGS: Record<string, string> = {
  beijing: 'beijing',
  shanghai: 'shanghai',
  chengdu: 'chengdu',
  xian: 'xian',
  guilin: 'guilin',
  hangzhou: 'hangzhou',
  guangzhou: 'guangzhou',
  shenzhen: 'shenzhen',
  chongqing: 'chongqing',
  suzhou: 'suzhou',
};

const KLOOK_CATEGORY_PATHS: Record<string, string> = {
  attraction: 'attraction',
  tour: 'tour',
  transport: 'transport',
};

export interface KlookLinkParams {
  city: string;
  category?: 'attraction' | 'tour' | 'transport';
}

export function buildKlookLink(params: KlookLinkParams): string {
  const AID = process.env.KLOOK_AFFILIATE_ID || 'demo';
  const cityKey = params.city.toLowerCase().replace(/\s+/g, '');
  const citySlug = KLOOK_CITY_SLUGS[cityKey] || cityKey;

  const base = `https://www.klook.com/en-US/city/${citySlug}/`;
  const query = new URLSearchParams({ aid: AID });

  if (params.category) {
    query.set('category', KLOOK_CATEGORY_PATHS[params.category] || params.category);
  }

  return `${base}?${query.toString()}`;
}

// ── Ctrip (Trip.com) ─────────────────────────────────────────────────────────

const CTRIP_TYPE_PATHS: Record<string, string> = {
  hotel: 'hotels',
  flight: 'flights',
  train: 'trains',
};

export interface CtripLinkParams {
  city: string;
  type: 'hotel' | 'flight' | 'train';
}

export function buildCtripLink(params: CtripLinkParams): string {
  const AID = process.env.CTRIP_AFFILIATE_ID || 'demo';
  const typePath = CTRIP_TYPE_PATHS[params.type];
  const cityEncoded = encodeURIComponent(params.city);

  // Trip.com affiliate uses a tracking URL with allianceid + sid
  // Format: https://www.trip.com/{type}/?city={city}&allianceid={AID}
  const base = `https://www.trip.com/${typePath}/`;
  const query = new URLSearchParams({
    city: cityEncoded,
    allianceid: AID,
    utm_source: 'travelerlocal',
    utm_medium: 'affiliate',
  });

  return `${base}?${query.toString()}`;
}

// ── Convenience helpers ───────────────────────────────────────────────────────

/**
 * Quick hotel search link for a city (Booking.com)
 */
export function hotelSearchLink(city: string, checkIn?: string, checkOut?: string): string {
  return buildBookingLink({ city, checkIn, checkOut, adults: 2 });
}

/**
 * Quick attraction link for a city (Klook)
 */
export function attractionLink(city: string): string {
  return buildKlookLink({ city, category: 'attraction' });
}

/**
 * Quick tour link for a city (Klook)
 */
export function tourLink(city: string): string {
  return buildKlookLink({ city, category: 'tour' });
}
