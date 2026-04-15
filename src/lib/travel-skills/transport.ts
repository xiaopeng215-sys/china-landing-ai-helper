/**
 * 交通技能模块
 * 中国主要交通方式使用指引
 */

export interface TransportGuide {
  type: 'metro' | 'highspeed-rail' | 'taxi' | 'didi' | 'bus';
  howToUse: string[];
  paymentMethods: string[];
  tips: string[];
  commonRoutes?: { from: string; to: string; duration: string; cost: string }[];
}

const TRANSPORT_GUIDES: Record<string, TransportGuide> = {
  metro: {
    type: 'metro',
    howToUse: [
      'Download the city metro app or use Alipay/WeChat mini-program for QR code entry',
      'At ticket machines: select English, choose destination, pay by card/cash/QR',
      'Scan QR code at gate entry and exit — fare is auto-calculated',
      'Follow signs in English and Chinese; all major stations have English signage',
      'Exits are labeled A, B, C, D — check the exit map before leaving the train',
    ],
    paymentMethods: [
      'Alipay (scan QR at gate)',
      'WeChat Pay (scan QR at gate)',
      'Transit card (rechargeable, buy at station)',
      'Cash (at ticket machines)',
      'Apple Pay / Google Pay (select cities)',
    ],
    tips: [
      'Metro is the fastest and cheapest way to get around major cities',
      'Fares range from ¥3-10 per trip depending on distance',
      'Rush hours: 7:30-9:00am and 5:30-7:30pm — expect crowds',
      'Last trains typically run until 11pm-midnight',
      'Security check required at all stations — allow extra time',
      'Available in: Beijing, Shanghai, Guangzhou, Shenzhen, Chengdu, Xi\'an, and 30+ other cities',
    ],
    commonRoutes: [
      { from: 'Beijing Capital Airport (T3)', to: 'Dongzhimen', duration: '25 min', cost: '¥25' },
      { from: 'Shanghai Pudong Airport', to: 'Longyang Road (Maglev)', duration: '8 min', cost: '¥50' },
      { from: 'Guangzhou South Station', to: 'Guangzhou East', duration: '30 min', cost: '¥6' },
    ],
  },

  'highspeed-rail': {
    type: 'highspeed-rail',
    howToUse: [
      'Book tickets on Trip.com (English) or 12306.cn (Chinese, requires registration)',
      'Passport required for ticket purchase — enter passport number exactly as shown',
      'Collect physical ticket at station self-service machines using passport',
      'Or use e-ticket: show passport + booking confirmation at gate',
      'Arrive 30 minutes before departure — security check required',
      'Find your carriage number and seat on the ticket; board from the correct platform',
    ],
    paymentMethods: [
      'Trip.com: Visa/Mastercard, PayPal, Alipay',
      '12306.cn: Chinese bank card, Alipay, WeChat Pay',
      'Station ticket windows: cash, Chinese bank card',
    ],
    tips: [
      'High-speed rail (高铁/G trains) is the best way to travel between cities',
      'G trains run at 300-350 km/h; D trains at 200-250 km/h',
      'Second class is comfortable and affordable; first class has more space',
      'Food cart comes through — bring snacks or buy at station',
      'Luggage: no strict limits but overhead racks are small; use checked luggage for large bags',
      'Stations are often outside city centers — factor in metro/taxi time',
    ],
    commonRoutes: [
      { from: 'Beijing', to: 'Shanghai', duration: '4.5 hours', cost: '¥553 (2nd class)' },
      { from: 'Beijing', to: 'Xi\'an', duration: '4.5 hours', cost: '¥515 (2nd class)' },
      { from: 'Shanghai', to: 'Hangzhou', duration: '1 hour', cost: '¥73 (2nd class)' },
      { from: 'Shanghai', to: 'Suzhou', duration: '25 min', cost: '¥30 (2nd class)' },
      { from: 'Guangzhou', to: 'Shenzhen', duration: '30 min', cost: '¥75 (2nd class)' },
      { from: 'Chengdu', to: 'Chongqing', duration: '1.5 hours', cost: '¥105 (2nd class)' },
    ],
  },

  taxi: {
    type: 'taxi',
    howToUse: [
      'Hail from the street or find a taxi stand at hotels, airports, and train stations',
      'Show the driver your destination in Chinese characters (use a translation app)',
      'Meter starts automatically — ensure driver turns it on',
      'Keep the receipt (发票) in case of disputes or lost items',
      'Airport taxis: use official taxi queues only, avoid touts',
    ],
    paymentMethods: [
      'Cash (RMB — always accepted)',
      'Alipay (most taxis)',
      'WeChat Pay (most taxis)',
      'Credit card (some taxis, not reliable)',
    ],
    tips: [
      'Starting fare: ¥13-15 in most cities, then ¥2-3 per km',
      'Night surcharge (11pm-5am): 20% extra',
      'Always use official metered taxis — avoid unlicensed "black cabs"',
      'Language barrier is common — have destination written in Chinese',
      'Didi is usually cheaper and easier for foreigners (see Didi guide)',
      'Taxis are harder to find during rain and rush hours',
    ],
  },

  didi: {
    type: 'didi',
    howToUse: [
      'Download Didi app (App Store or Google Play)',
      'Register with phone number; link a foreign credit card or Alipay',
      'Enter pickup and destination (English search works in major cities)',
      'Choose ride type: Express (快车) for standard, Premier for comfort',
      'Driver details and license plate shown in app — verify before boarding',
      'Rate the driver after the trip',
    ],
    paymentMethods: [
      'Alipay (recommended)',
      'WeChat Pay',
      'Foreign Visa/Mastercard (linked in app)',
      'Cash (select option in app)',
    ],
    tips: [
      'Didi is China\'s dominant ride-hailing app — like Uber',
      'Fares are typically 20-30% cheaper than taxis',
      'Upfront pricing — no surprises',
      'Driver may call you — have a Chinese speaker available or use in-app chat',
      'DiDi International version available for some countries',
      'Peak hours (rush hour, rain, holidays) have surge pricing',
      'Airport pickups: meet at designated Didi pickup zones',
    ],
    commonRoutes: [
      { from: 'Beijing Capital Airport', to: 'Sanlitun', duration: '40-60 min', cost: '¥80-120' },
      { from: 'Shanghai Hongqiao Airport', to: 'The Bund', duration: '30-45 min', cost: '¥60-90' },
    ],
  },

  bus: {
    type: 'bus',
    howToUse: [
      'Find bus routes using Baidu Maps (Chinese) or Amap — search in English works',
      'Board from the front door; exit from the back',
      'Tap transit card or scan Alipay/WeChat QR code on the reader',
      'Or pay exact cash into the fare box (driver cannot give change)',
      'Announce your stop or watch the digital display',
    ],
    paymentMethods: [
      'Transit card (most convenient)',
      'Alipay (scan QR)',
      'WeChat Pay (scan QR)',
      'Exact cash',
    ],
    tips: [
      'Flat fare: ¥1-2 per trip in most cities',
      'Buses are slower than metro but cover more areas',
      'Useful for scenic routes and areas without metro',
      'Bus stops have route maps — look for English translations in tourist areas',
      'Long-distance buses (长途汽车) connect cities not served by rail',
    ],
  },
};

/**
 * 获取交通方式指引
 * @param type 交通类型
 */
export function getTransportGuide(type: string): TransportGuide {
  const key = type.toLowerCase().replace(/\s+/g, '-');
  return TRANSPORT_GUIDES[key] || TRANSPORT_GUIDES['didi'];
}

/**
 * 根据出发地和目的地推荐交通方式
 * @param from 出发地
 * @param to 目的地
 */
export function getRouteRecommendation(from: string, to: string): TransportGuide[] {
  const fromLower = from.toLowerCase();
  const toLower = to.toLowerCase();

  // 城市间路线 → 高铁优先
  const majorCities = ['beijing', 'shanghai', 'guangzhou', 'shenzhen', 'chengdu', 'xi\'an', "xi'an", 'xian', 'hangzhou', 'chongqing', 'wuhan', 'nanjing'];
  const isInterCity = majorCities.some(c => fromLower.includes(c)) && majorCities.some(c => toLower.includes(c));

  if (isInterCity) {
    return [
      TRANSPORT_GUIDES['highspeed-rail'],
      TRANSPORT_GUIDES['didi'],
    ];
  }

  // 机场路线 → 地铁 + 滴滴
  if (fromLower.includes('airport') || toLower.includes('airport')) {
    return [
      TRANSPORT_GUIDES['metro'],
      TRANSPORT_GUIDES['didi'],
      TRANSPORT_GUIDES['taxi'],
    ];
  }

  // 市内路线 → 地铁 + 滴滴
  return [
    TRANSPORT_GUIDES['metro'],
    TRANSPORT_GUIDES['didi'],
    TRANSPORT_GUIDES['bus'],
  ];
}
