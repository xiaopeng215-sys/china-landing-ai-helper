/**
 * 住宿技能模块
 * 住宿预订和入住指引
 */

export interface AccommodationGuide {
  type: 'hotel' | 'hostel' | 'airbnb' | 'capsule';
  bookingPlatforms: { name: string; url: string; pros: string[] }[];
  checkInRequirements: string[];
  tips: string[];
  priceRange: { budget: string; mid: string; luxury: string };
}

// 城市特定住宿数据
const CITY_ACCOMMODATION: Record<string, Partial<AccommodationGuide>> = {
  beijing: {
    tips: [
      'Stay near a metro line — Beijing is huge and traffic is heavy',
      'Sanlitun and Chaoyang: expat-friendly, good nightlife and restaurants',
      'Dongcheng (near Forbidden City): best for sightseeing, pricier',
      'Wudaokou: university area, budget-friendly, young crowd',
      'Book Great Wall tours through your hotel for convenience',
      'Air quality varies — check AQI before outdoor activities',
    ],
    priceRange: {
      budget: '¥150-300/night (hostels, budget hotels)',
      mid: '¥400-800/night (3-4 star hotels)',
      luxury: '¥1,200+/night (5 star, international chains)',
    },
  },
  shanghai: {
    tips: [
      'The Bund area: most scenic but expensive',
      'French Concession: charming, walkable, great cafes and restaurants',
      'Jing\'an: central, good metro access, mix of old and new',
      'Pudong: modern, near airport, good for business travelers',
      'Book well in advance during Golden Week (Oct 1-7) and Chinese New Year',
    ],
    priceRange: {
      budget: '¥180-350/night (hostels, budget hotels)',
      mid: '¥500-1,000/night (3-4 star hotels)',
      luxury: '¥1,500+/night (5 star, international chains)',
    },
  },
  chengdu: {
    tips: [
      'Jinjiang District: central, near Tianfu Square and metro',
      'Kuanzhai Alley area: great for atmosphere and local food',
      'Book panda base tours early — morning slots sell out fast',
      'Chengdu is more affordable than Beijing/Shanghai',
      'Spicy food capital — tell restaurants your spice tolerance',
    ],
    priceRange: {
      budget: '¥100-200/night (hostels, budget hotels)',
      mid: '¥300-600/night (3-4 star hotels)',
      luxury: '¥800+/night (5 star hotels)',
    },
  },
  xian: {
    tips: [
      'Stay inside or near the Ancient City Wall for best access',
      'Muslim Quarter area: great food, lively atmosphere',
      'Book Terracotta Warriors tickets online in advance',
      'Xi\'an is compact — most sights accessible by metro or taxi',
    ],
    priceRange: {
      budget: '¥100-200/night',
      mid: '¥250-500/night',
      luxury: '¥700+/night',
    },
  },
};

const DEFAULT_ACCOMMODATION: AccommodationGuide = {
  type: 'hotel',
  bookingPlatforms: [
    {
      name: 'Trip.com (Ctrip)',
      url: 'https://www.trip.com',
      pros: [
        'Largest selection of Chinese hotels',
        'English interface',
        'Accepts foreign credit cards',
        'Customer service in English',
        'Best prices for domestic hotels',
      ],
    },
    {
      name: 'Booking.com',
      url: 'https://www.booking.com',
      pros: [
        'Familiar international platform',
        'Free cancellation options',
        'Good for international chain hotels',
        'Reviews in multiple languages',
      ],
    },
    {
      name: 'Agoda',
      url: 'https://www.agoda.com',
      pros: [
        'Strong Asia coverage',
        'Competitive prices',
        'Accepts foreign cards',
        'Good last-minute deals',
      ],
    },
    {
      name: 'Airbnb',
      url: 'https://www.airbnb.com',
      pros: [
        'Apartments and unique stays',
        'Good for longer stays',
        'Kitchen facilities available',
        'Local neighborhood experience',
      ],
    },
  ],
  checkInRequirements: [
    'Original passport (mandatory — hotels must register foreign guests with police)',
    'Booking confirmation (email or app)',
    'Credit card for deposit (¥500-2,000 depending on hotel)',
    'Check-in time: typically 2pm-3pm; check-out: 12pm',
    'Early check-in may be available for a fee or if room is ready',
    'Some budget hotels may not accept foreign guests — book international-friendly hotels',
  ],
  tips: [
    'Always book hotels that explicitly accept foreign guests (外国人可入住)',
    'Passport registration with local police is done automatically by the hotel',
    'If staying with friends/Airbnb, you must register at the local police station within 24 hours',
    'International chain hotels (Marriott, Hilton, IHG) always accept foreigners',
    'Request a room away from elevator/street for quieter sleep',
    'Most hotels provide free WiFi — ask for the password at check-in',
    'Breakfast included (含早餐) is common in mid-range hotels',
  ],
  priceRange: {
    budget: '¥100-300/night',
    mid: '¥300-800/night',
    luxury: '¥800+/night',
  },
};

/**
 * 获取城市住宿指引
 * @param city 城市名称
 */
export function getAccommodationGuide(city: string): AccommodationGuide {
  const cityKey = city.toLowerCase().replace(/\s+/g, '').replace(/'/g, '');
  const cityData = CITY_ACCOMMODATION[cityKey] || {};

  return {
    ...DEFAULT_ACCOMMODATION,
    ...cityData,
    tips: cityData.tips || DEFAULT_ACCOMMODATION.tips,
    priceRange: cityData.priceRange || DEFAULT_ACCOMMODATION.priceRange,
  };
}

/**
 * 生成住宿预订清单
 * @param city 城市名称
 */
export function generateBookingChecklist(city: string): string[] {
  const guide = getAccommodationGuide(city);

  return [
    `🏨 Search hotels in ${city} on Trip.com or Booking.com`,
    '✅ Confirm hotel accepts foreign guests (check reviews or contact hotel)',
    '📅 Book early — especially for Golden Week (Oct 1-7) and Chinese New Year',
    '💳 Have a credit card ready for deposit (¥500-2,000)',
    '🛂 Bring original passport — required for check-in (no exceptions)',
    '📧 Save booking confirmation to phone (offline access)',
    `💰 Budget: ${guide.priceRange.budget} (budget) / ${guide.priceRange.mid} (mid-range)`,
    '🚇 Choose location near a metro station for easy city access',
    '📶 Ask for WiFi password at check-in',
    '⏰ Check-in time: 2-3pm; check-out: 12pm — arrange luggage storage if needed',
    '🔑 Keep hotel business card with address in Chinese for taxis',
    '📱 Save hotel phone number for emergencies',
  ];
}
