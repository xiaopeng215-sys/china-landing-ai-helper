import { NextRequest, NextResponse } from 'next/server';

// Station code mapping for 12306 / Trip.com
const STATION_CODES: Record<string, { code: string; name: string }> = {
  shanghai: { code: 'SHH', name: 'Shanghai' },
  beijing: { code: 'BJP', name: 'Beijing' },
  chengdu: { code: 'CDW', name: 'Chengdu' },
  xian: { code: 'XAY', name: "Xi'an" },
  guangzhou: { code: 'GZQ', name: 'Guangzhou' },
  shenzhen: { code: 'SZQ', name: 'Shenzhen' },
  hangzhou: { code: 'HZH', name: 'Hangzhou' },
  chongqing: { code: 'CQW', name: 'Chongqing' },
  nanjing: { code: 'NJH', name: 'Nanjing' },
  wuhan: { code: 'WHN', name: 'Wuhan' },
  guilin: { code: 'GLQ', name: 'Guilin' },
  zhangjiajie: { code: 'ZJJ', name: 'Zhangjiajie' },
};

function getStation(city: string) {
  return STATION_CODES[city.toLowerCase()] || { code: city.toUpperCase(), name: city };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const depDate = searchParams.get('depDate'); // YYYY-MM-DD

  if (!origin) {
    return NextResponse.json({ error: 'Missing origin parameter' }, { status: 400 });
  }

  const from = getStation(origin);
  const to = destination ? getStation(destination) : null;

  // Trip.com train search URL
  const tripUrl = `https://trains.trip.com/trains/search?fromStationName=${encodeURIComponent(from.name)}&toStationName=${encodeURIComponent(to?.name || '')}&depDate=${depDate || ''}`;

  // 12306 official URL
  const url12306 = `https://www.12306.cn/index/`;

  return NextResponse.json({
    type: 'redirect',
    links: [
      { provider: 'Trip.com', url: tripUrl, logo: '🚄' },
      { provider: '12306 (Official)', url: url12306, logo: '🇨🇳' },
    ],
    searchParams: { origin: from.name, destination: to?.name, date: depDate },
    tip: 'Book via Trip.com for English support, or 12306 for official tickets.',
  });
}
