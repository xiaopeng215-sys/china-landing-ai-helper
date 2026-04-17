import { NextRequest, NextResponse } from 'next/server';

// City code mapping for Trip.com
const CITY_CODES: Record<string, string> = {
  shanghai: 'SHA', beijing: 'BJS', chengdu: 'CTU', xian: 'SIA',
  guangzhou: 'CAN', shenzhen: 'SZX', hangzhou: 'HGH', chongqing: 'CKG',
  nanjing: 'NKG', wuhan: 'WUH', kunming: 'KMG', qingdao: 'TAO',
  xiamen: 'XMN', sanya: 'SYX', guilin: 'KWL', zhangjiajie: 'DYG',
};

function getCityCode(city: string): string {
  return CITY_CODES[city.toLowerCase()] || city.toUpperCase();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const depDate = searchParams.get('depDate'); // YYYY-MM-DD

  if (!origin) {
    return NextResponse.json({ error: 'Missing origin parameter' }, { status: 400 });
  }

  const originCode = getCityCode(origin);
  const destCode = destination ? getCityCode(destination) : '';
  const dateStr = depDate ? depDate.replace(/-/g, '') : '';

  // Trip.com flight search URL
  const tripUrl = `https://flights.trip.com/search/oneway-${originCode}-${destCode}?depdate=${dateStr}&cabin=y&curr=CNY`;

  // Also provide Ctrip (携程) as alternative
  const ctripUrl = `https://flights.ctrip.com/online/list/oneway-${originCode}-${destCode}?depdate=${depDate || ''}&cabin=Y`;

  return NextResponse.json({
    type: 'redirect',
    links: [
      { provider: 'Trip.com', url: tripUrl, logo: '✈️' },
      { provider: 'Ctrip (携程)', url: ctripUrl, logo: '🛫' },
    ],
    searchParams: { origin: originCode, destination: destCode, date: depDate },
  });
}
