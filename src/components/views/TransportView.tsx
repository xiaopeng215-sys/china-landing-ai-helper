'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClientI18n } from '@/lib/i18n/client';

// ============================================================
// FlyAI types (mirror of lib/flyai.ts)
// ============================================================
export interface FlightSegment {
  depCityName: string;
  depStationName: string;
  depDateTime: string;
  arrCityName: string;
  arrStationName: string;
  arrDateTime: string;
  duration: string;
  transportType: string;
  marketingTransportName: string;
  marketingTransportNo: string;
  seatClassName: string;
  depTerm?: string;
  arrTerm?: string;
}

export interface FlightResult {
  ticketPrice: string;
  totalDuration: string;
  journeyType: string;
  segments: FlightSegment[];
  jumpUrl: string;
}

export interface TrainSegment {
  depCityName: string;
  depStationName: string;
  depDateTime: string;
  arrCityName: string;
  arrStationName: string;
  arrDateTime: string;
  duration: string;
  transportType: string;
  marketingTransportNo: string;
  seatClassName: string;
}

export interface TrainResult {
  price: string;
  totalDuration: string;
  journeyType: string;
  segments: TrainSegment[];
  jumpUrl: string;
}

// ============================================================
// Static data
// ============================================================
type City = 'shanghai' | 'beijing' | 'chengdu' | 'xian' | 'guangzhou';

interface AirportInfo {
  name: string;
  code: string;
  options: { mode: string; icon: string; duration: string; price: string; tip: string }[];
}

interface MetroInfo {
  lines: string;
  hours: string;
  price: string;
  app: string;
  tips: string[];
}

interface CityTransportData {
  airport: AirportInfo;
  metro: MetroInfo;
}

const CITY_DATA: Record<City, CityTransportData> = {
  shanghai: {
    airport: {
      name: 'Pudong International Airport',
      code: 'PVG',
      options: [
        { mode: 'Maglev + Metro', icon: '🚄', duration: '~50 min', price: '¥55', tip: 'Fastest option — maglev to Longyang Rd, then metro' },
        { mode: 'Metro Line 2', icon: '🚇', duration: '~70 min', price: '¥8', tip: 'Cheapest — direct to People\'s Square' },
        { mode: 'DiDi / Taxi', icon: '🚕', duration: '~60 min', price: '¥150-200', tip: 'Convenient with luggage, use DiDi app' },
        { mode: 'Airport Bus', icon: '🚌', duration: '~90 min', price: '¥22-30', tip: 'Multiple routes to different city areas' },
      ],
    },
    metro: {
      lines: '20 lines covering the whole city',
      hours: '5:30am – 11:00pm',
      price: '¥3–8 per trip',
      app: 'Metro Man / Alipay',
      tips: [
        'Use Alipay or WeChat to scan QR at turnstile',
        'Line 2 connects both airports',
        'Avoid 8–9am and 5–7pm rush hours',
        'Most signs and announcements in English',
      ],
    },
  },
  beijing: {
    airport: {
      name: 'Beijing Capital International Airport',
      code: 'PEK',
      options: [
        { mode: 'Airport Express', icon: '🚄', duration: '~20 min', price: '¥25', tip: 'Fastest — runs every 10 min to Dongzhimen' },
        { mode: 'Metro Line 10', icon: '🚇', duration: '~60 min', price: '¥6', tip: 'Transfer at Sanyuanqiao to Line 10' },
        { mode: 'DiDi / Taxi', icon: '🚕', duration: '~45 min', price: '¥100-150', tip: 'Use DiDi — avoid unlicensed touts' },
        { mode: 'Airport Bus', icon: '🚌', duration: '~60 min', price: '¥24-30', tip: '7 routes to different city areas' },
      ],
    },
    metro: {
      lines: '27 lines, extensive network',
      hours: '5:00am – 11:30pm',
      price: '¥3–10 per trip',
      app: 'Beijing Subway / Alipay',
      tips: [
        'Security check required at every station',
        'Line 1 runs east-west through city center',
        'Avoid rush hours — very crowded',
        'English announcements on all lines',
      ],
    },
  },
  chengdu: {
    airport: {
      name: 'Chengdu Tianfu International Airport',
      code: 'TFU',
      options: [
        { mode: 'Metro Line 18', icon: '🚇', duration: '~40 min', price: '¥10', tip: 'Direct express metro to city center' },
        { mode: 'DiDi / Taxi', icon: '🚕', duration: '~50 min', price: '¥120-180', tip: 'Convenient, use DiDi for English interface' },
        { mode: 'Airport Bus', icon: '🚌', duration: '~60 min', price: '¥30', tip: 'Multiple routes to downtown' },
      ],
    },
    metro: {
      lines: '13 lines',
      hours: '6:00am – 11:00pm',
      price: '¥2–6 per trip',
      app: 'Chengdu Metro / Alipay',
      tips: [
        'Line 1 and 2 cover main tourist areas',
        'Very affordable compared to other cities',
        'Panda Base accessible via Line 3',
        'Scan Alipay QR for easy payment',
      ],
    },
  },
  xian: {
    airport: {
      name: "Xi'an Xianyang International Airport",
      code: 'XIY',
      options: [
        { mode: 'Metro Line 14', icon: '🚇', duration: '~40 min', price: '¥8', tip: 'New direct metro line to city center' },
        { mode: 'DiDi / Taxi', icon: '🚕', duration: '~45 min', price: '¥80-120', tip: 'Reliable option, use DiDi app' },
        { mode: 'Airport Bus', icon: '🚌', duration: '~60 min', price: '¥30', tip: 'Multiple routes, check destination carefully' },
      ],
    },
    metro: {
      lines: '8 lines',
      hours: '6:00am – 11:00pm',
      price: '¥2–5 per trip',
      app: "Xi'an Metro / Alipay",
      tips: [
        'Line 2 runs north-south through city center',
        'Muslim Quarter is a short walk from Bell Tower station',
        'Terracotta Warriors accessible via bus from North Square',
        'City Wall area well-served by metro',
      ],
    },
  },
  guangzhou: {
    airport: {
      name: 'Guangzhou Baiyun International Airport',
      code: 'CAN',
      options: [
        { mode: 'Metro Line 3', icon: '🚇', duration: '~45 min', price: '¥8', tip: 'Direct metro to city center' },
        { mode: 'DiDi / Taxi', icon: '🚕', duration: '~40 min', price: '¥100-150', tip: 'Use DiDi for English interface' },
        { mode: 'Airport Bus', icon: '🚌', duration: '~60 min', price: '¥25', tip: 'Multiple routes to different areas' },
      ],
    },
    metro: {
      lines: '18 lines',
      hours: '6:00am – 11:30pm',
      price: '¥2–8 per trip',
      app: 'Guangzhou Metro / Alipay',
      tips: [
        "One of China's most extensive metro networks",
        'Line 1 connects major tourist spots',
        'Cantonese and Mandarin announcements',
        'Alipay QR code payment widely accepted',
      ],
    },
  },
};

const DIDI_STEPS = [
  { step: '1', title: 'Download DiDi', desc: 'Available on App Store & Google Play. Select "International" version.', icon: '📱' },
  { step: '2', title: 'Register with Phone', desc: 'Use your international phone number. SMS verification required.', icon: '📞' },
  { step: '3', title: 'Add Payment', desc: 'Link international Visa/Mastercard or use Alipay/WeChat Pay.', icon: '💳' },
  { step: '4', title: 'Book a Ride', desc: 'Enter destination in English or Chinese. Driver will find you.', icon: '🚕' },
  { step: '5', title: 'Show Driver', desc: "Show your phone screen — driver sees your destination in Chinese.", icon: '📍' },
];

const RAIL_TIPS = [
  { icon: '🎫', title: 'Buy Tickets', desc: 'Use Trip.com or 12306.cn (requires Chinese ID for some routes). Book early for holidays.' },
  { icon: '🪪', title: 'Passport Required', desc: 'Bring your passport to collect tickets at station kiosks. Foreign passport works fine.' },
  { icon: '⏰', title: 'Arrive Early', desc: 'Arrive 30–45 min before departure. Security check + ticket collection takes time.' },
  { icon: '🚄', title: 'G-Train vs D-Train', desc: 'G-trains are fastest (350km/h). D-trains are slightly slower but cheaper.' },
  { icon: '🍱', title: 'Food on Board', desc: 'Dining car available on most trains. Bring snacks for long journeys.' },
];

const CITIES: { id: City; label: string; flag: string }[] = [
  { id: 'shanghai', label: 'Shanghai', flag: '🏙️' },
  { id: 'beijing', label: 'Beijing', flag: '🏯' },
  { id: 'chengdu', label: 'Chengdu', flag: '🐼' },
  { id: 'xian', label: "Xi'an", flag: '🏺' },
  { id: 'guangzhou', label: 'Guangzhou', flag: '🌸' },
];

type Section = 'airport' | 'metro' | 'didi' | 'rail' | 'flights' | 'trains';

const TRIP_AFFILIATE = 'https://www.trip.com/t/gBO6LQDOIU2';

// ============================================================
// Helper: format datetime string "2025-04-18 08:30" → "08:30"
// ============================================================
function fmtTime(dt: string) {
  if (!dt) return '--:--';
  const parts = dt.split(' ');
  return parts.length >= 2 ? parts[1].slice(0, 5) : dt.slice(11, 16);
}

function fmtDate(dt: string) {
  if (!dt) return '';
  return dt.split(' ')[0];
}

// ============================================================
// Loading skeleton card
// ============================================================
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
        <div className="h-6 bg-gray-200 rounded w-16" />
      </div>
    </div>
  );
}

// ============================================================
// Flight result card with motion
// ============================================================
const FlightCard: React.FC<{ result: FlightResult; index: number }> = ({ result, index }) => {
  const seg = result.segments[0];
  if (!seg) return null;

  const depTime = fmtTime(seg.depDateTime);
  const arrTime = fmtTime(seg.arrDateTime);
  const depDate = fmtDate(seg.depDateTime);
  const airline = seg.marketingTransportName || seg.marketingTransportNo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
      className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-shadow"
    >
      {/* Airline + flight no */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-sm">✈️</div>
        <span className="font-semibold text-sm text-[#484848]">{airline}</span>
        <span className="text-xs text-[#767676] ml-auto">{seg.marketingTransportNo}</span>
      </div>

      {/* Times */}
      <div className="flex items-center gap-2 mb-2">
        <div className="text-center">
          <p className="text-lg font-bold text-[#484848]">{depTime}</p>
          <p className="text-xs text-[#767676]">{seg.depCityName}</p>
          <p className="text-xs text-[#767676]">{seg.depStationName}{seg.depTerm ? ` T${seg.depTerm}` : ''}</p>
        </div>
        <div className="flex-1 flex flex-col items-center px-2">
          <p className="text-xs text-[#767676] mb-0.5">{result.totalDuration || seg.duration}</p>
          <div className="w-full h-px bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
          </div>
          <p className="text-xs text-blue-500 mt-0.5">Direct</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-[#484848]">{arrTime}</p>
          <p className="text-xs text-[#767676]">{seg.arrCityName}</p>
          <p className="text-xs text-[#767676]">{seg.arrStationName}{seg.arrTerm ? ` T${seg.arrTerm}` : ''}</p>
        </div>
      </div>

      {/* Date + seat + price */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div>
          {depDate && <p className="text-xs text-[#767676]">📅 {depDate}</p>}
          <p className="text-xs text-[#767676]">💺 {seg.seatClassName || 'Economy'}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-[#ff5a5f]">¥{result.ticketPrice}</p>
          {result.jumpUrl && (
            <a
              href={result.jumpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-1 px-3 py-1 bg-[#ff5a5f] text-white text-xs rounded-full font-medium hover:bg-[#e63235] transition-colors"
            >
              Book →
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================
// Train result card with motion
// ============================================================
const TrainCard: React.FC<{ result: TrainResult; index: number }> = ({ result, index }) => {
  const seg = result.segments[0];
  if (!seg) return null;

  const depTime = fmtTime(seg.depDateTime);
  const arrTime = fmtTime(seg.arrDateTime);
  const depDate = fmtDate(seg.depDateTime);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
      className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-shadow"
    >
      {/* Train no */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-sm">🚄</div>
        <span className="font-semibold text-sm text-[#484848]">{seg.marketingTransportNo}</span>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-auto">
          {seg.transportType?.includes('G') ? 'G-Train' : seg.transportType?.includes('D') ? 'D-Train' : 'Train'}
        </span>
      </div>

      {/* Times */}
      <div className="flex items-center gap-2 mb-2">
        <div className="text-center">
          <p className="text-lg font-bold text-[#484848]">{depTime}</p>
          <p className="text-xs text-[#767676]">{seg.depStationName}</p>
        </div>
        <div className="flex-1 flex flex-col items-center px-2">
          <p className="text-xs text-[#767676] mb-0.5">{result.totalDuration || seg.duration}</p>
          <div className="w-full h-px bg-gradient-to-r from-green-200 via-green-400 to-green-200 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full" />
          </div>
          <p className="text-xs text-green-500 mt-0.5">Direct</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-[#484848]">{arrTime}</p>
          <p className="text-xs text-[#767676]">{seg.arrStationName}</p>
        </div>
      </div>

      {/* Date + seat + price */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div>
          {depDate && <p className="text-xs text-[#767676]">📅 {depDate}</p>}
          <p className="text-xs text-[#767676]">💺 {seg.seatClassName || 'Second Class'}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-[#34a853]">¥{result.price}</p>
          {result.jumpUrl && (
            <a
              href={result.jumpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-1 px-3 py-1 bg-[#34a853] text-white text-xs rounded-full font-medium hover:bg-[#2d8f4e] transition-colors"
            >
              Book →
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================
// Main component
// ============================================================
export default function TransportView() {
  const { t } = useClientI18n();
  const [selectedCity, setSelectedCity] = useState<City>('shanghai');
  const [activeSection, setActiveSection] = useState<Section>('airport');
  const [fromInput, setFromInput] = useState('');
  const [toInput, setToInput] = useState('');

  // ---- Flights state ----
  const [flightFrom, setFlightFrom] = useState('SHA');
  const [flightTo, setFlightTo] = useState('PEK');
  const [flightDate, setFlightDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [flightPassengers, setFlightPassengers] = useState(1);
  const [flightResults, setFlightResults] = useState<FlightResult[]>([]);
  const [flightLoading, setFlightLoading] = useState(false);
  const [flightError, setFlightError] = useState<string | null>(null);
  const [flightSearched, setFlightSearched] = useState(false);

  // ---- Trains state ----
  const [trainFrom, setTrainFrom] = useState('Beijing');
  const [trainTo, setTrainTo] = useState('Shanghai');
  const [trainDate, setTrainDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [trainResults, setTrainResults] = useState<TrainResult[]>([]);
  const [trainLoading, setTrainLoading] = useState(false);
  const [trainError, setTrainError] = useState<string | null>(null);
  const [trainSearched, setTrainSearched] = useState(false);

  const handleFlightSearch = async () => {
    setFlightLoading(true);
    setFlightError(null);
    setFlightResults([]);
    setFlightSearched(true);
    try {
      const params = new URLSearchParams({
        origin: flightFrom,
        destination: flightTo,
        depDate: flightDate,
      });
      const res = await fetch(`/api/flight?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // TODO: Replace with real FlyAI data when API route is fully deployed
      // Expected FlyAI shape: { status: 0, data: { itemList: [...] } }
      // For now, render redirect links if returned, or show error
      if (data.type === 'redirect' && data.links?.length) {
        // API not yet hooked to FlyAI — show friendly message
        setFlightError('Live flight data not yet connected. Showing Trip.com links below.');
        // Build mock cards from redirect links so UI is not empty
        setFlightResults([]);
      } else if (data.status === 0 && data.data?.itemList?.length) {
        // Real FlyAI response
        setFlightResults(
          data.data.itemList.map((item: any): FlightResult => ({
            ticketPrice: item.ticketPrice,
            totalDuration: item.totalDuration,
            journeyType: item.journeys?.[0]?.journeyType || '',
            segments: item.journeys?.[0]?.segments || [],
            jumpUrl: item.jumpUrl,
          }))
        );
      } else {
        setFlightError('No flights found for this route.');
      }
    } catch (err: any) {
      setFlightError(err.message || 'Search failed. Please try again.');
    } finally {
      setFlightLoading(false);
    }
  };

  const handleTrainSearch = async () => {
    setTrainLoading(true);
    setTrainError(null);
    setTrainResults([]);
    setTrainSearched(true);
    try {
      const params = new URLSearchParams({
        origin: trainFrom,
        destination: trainTo,
        depDate: trainDate,
      });
      const res = await fetch(`/api/train?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data.type === 'redirect' && data.links?.length) {
        // TODO: API not yet hooked to FlyAI
        setTrainError('Live train data not yet connected. Showing Trip.com links below.');
        setTrainResults([]);
      } else if (data.status === 0 && data.data?.itemList?.length) {
        setTrainResults(
          data.data.itemList.map((item: any): TrainResult => ({
            price: item.price || item.adultPrice,
            totalDuration: item.totalDuration,
            journeyType: item.journeys?.[0]?.journeyType || '',
            segments: item.journeys?.[0]?.segments || [],
            jumpUrl: item.jumpUrl,
          }))
        );
      } else {
        setTrainError('No trains found for this route.');
      }
    } catch (err: any) {
      setTrainError(err.message || 'Search failed. Please try again.');
    } finally {
      setTrainLoading(false);
    }
  };

  // Fallback to Trip.com external search
  const handleTripAffiliate = (type: 'flight' | 'train') => {
    const url = new URL(TRIP_AFFILIATE);
    if (type === 'flight') {
      url.searchParams.set('dcity', flightFrom);
      url.searchParams.set('acity', flightTo);
      if (flightDate) url.searchParams.set('ddate', flightDate);
      url.searchParams.set('adult', String(flightPassengers));
    } else {
      url.searchParams.set('from', trainFrom);
      url.searchParams.set('to', trainTo);
      if (trainDate) url.searchParams.set('date', trainDate);
    }
    window.open(url.toString(), '_blank', 'noopener,noreferrer');
  };

  const cityData = CITY_DATA[selectedCity];

  const sections: { id: Section; label: string; icon: string }[] = [
    { id: 'airport', label: t('TransportPage.sectionAirport'), icon: '✈️' },
    { id: 'metro', label: t('TransportPage.sectionMetro'), icon: '🚇' },
    { id: 'didi', label: t('TransportPage.sectionDidi'), icon: '🚕' },
    { id: 'rail', label: t('TransportPage.sectionRail'), icon: '🚄' },
    { id: 'flights', label: 'Flights', icon: '🛫' },
    { id: 'trains', label: 'Trains', icon: '🚅' },
  ];

  // City code mapping for display
  const FLIGHT_CITIES = [
    { value: 'SHA', label: 'Shanghai (SHA)' },
    { value: 'PEK', label: 'Beijing (PEK)' },
    { value: 'CTU', label: 'Chengdu (CTU)' },
    { value: 'CAN', label: 'Guangzhou (CAN)' },
    { value: 'XIY', label: "Xi'an (XIY)" },
    { value: 'HGH', label: 'Hangzhou (HGH)' },
    { value: 'SZX', label: 'Shenzhen (SZX)' },
  ];

  const POPULAR_FLIGHTS = [
    { from: 'SHA', to: 'PEK', label: 'Shanghai → Beijing' },
    { from: 'PEK', to: 'CTU', label: 'Beijing → Chengdu' },
    { from: 'CAN', to: 'SHA', label: 'Guangzhou → Shanghai' },
  ];

  const POPULAR_TRAINS = [
    { from: 'Beijing', to: 'Shanghai', label: 'Beijing → Shanghai' },
    { from: 'Chengdu', to: "Xi'an", label: "Chengdu → Xi'an" },
    { from: 'Shanghai', to: 'Hangzhou', label: 'Shanghai → Hangzhou' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-[#484848]">{t('TransportPage.title')}</h1>
          <p className="text-sm text-[#767676]">{t('TransportPage.subtitle')}</p>
          <p className="text-xs text-gray-400 mt-1">📊 Routes & prices from official metro apps, 12306 & Didi · Updated April 2026</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* Route Planner */}
        <div className="bg-white rounded-3xl shadow-xl p-5 border border-gray-100">
          <h3 className="text-base font-bold text-[#484848] mb-4">🗺️ {t('TransportPage.routePlanner')}</h3>
          <div className="space-y-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#767676] text-sm">🟢</span>
              <input
                type="text"
                value={fromInput}
                onChange={(e) => setFromInput(e.target.value)}
                placeholder={t('TransportPage.fromPlaceholder')}
                className="w-full pl-9 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a73e8] text-sm transition-all"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#767676] text-sm">🔴</span>
              <input
                type="text"
                value={toInput}
                onChange={(e) => setToInput(e.target.value)}
                placeholder={t('TransportPage.toPlaceholder')}
                className="w-full pl-9 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a73e8] text-sm transition-all"
              />
            </div>
            <button
              onClick={() => {
                if (fromInput || toInput) {
                  window.location.href = `/?tab=chat&q=${encodeURIComponent(`How do I get from ${fromInput || 'my location'} to ${toInput || 'my destination'} in China?`)}`;
                }
              }}
              className="w-full py-3 bg-gradient-to-r from-[#1a73e8] to-[#174ea6] text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all"
            >
              {t('TransportPage.planRoute')} →
            </button>
          </div>
        </div>

        {/* City Selector */}
        <div>
          <p className="text-sm font-medium text-[#484848] mb-2">{t('TransportPage.selectCity')}</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CITIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCity(c.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCity === c.id
                    ? 'bg-[#1a73e8] text-white shadow-md'
                    : 'bg-white text-[#484848] border border-gray-200 hover:border-[#1a73e8]'
                }`}
              >
                {c.flag} {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section Tabs */}
        <div className="grid grid-cols-3 gap-2">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl text-xs font-medium transition-all ${
                activeSection === s.id
                  ? 'bg-[#1a73e8] text-white shadow-md'
                  : 'bg-white text-[#484848] border border-gray-200 hover:border-[#1a73e8]'
              }`}
            >
              <span className="text-xl">{s.icon}</span>
              <span className="text-center leading-tight">{s.label}</span>
            </button>
          ))}
        </div>

        {/* ── Airport Section ── */}
        {activeSection === 'airport' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <h3 className="font-bold text-[#484848] mb-1">{cityData.airport.name}</h3>
              <p className="text-xs text-[#767676] mb-4">IATA: {cityData.airport.code}</p>
              <div className="space-y-3">
                {cityData.airport.options.map((opt, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="text-2xl flex-shrink-0">{opt.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm text-[#484848]">{opt.mode}</p>
                        <div className="text-right">
                          <p className="text-xs font-bold text-[#34a853]">{opt.price}</p>
                          <p className="text-xs text-[#767676]">{opt.duration}</p>
                        </div>
                      </div>
                      <p className="text-xs text-[#767676] mt-1">{opt.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Metro Section ── */}
        {activeSection === 'metro' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-amber-50 rounded-xl p-3">
                  <p className="text-xs text-[#767676]">Network</p>
                  <p className="font-semibold text-sm text-[#484848]">{cityData.metro.lines}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3">
                  <p className="text-xs text-[#767676]">Hours</p>
                  <p className="font-semibold text-sm text-[#484848]">{cityData.metro.hours}</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-3">
                  <p className="text-xs text-[#767676]">Price</p>
                  <p className="font-semibold text-sm text-[#484848]">{cityData.metro.price}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-3">
                  <p className="text-xs text-[#767676]">App</p>
                  <p className="font-semibold text-sm text-[#484848]">{cityData.metro.app}</p>
                </div>
              </div>
              <h4 className="font-semibold text-sm text-[#484848] mb-3">{t('TransportPage.proTips')}</h4>
              <ul className="space-y-2">
                {cityData.metro.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#767676]">
                    <span className="text-[#34a853] mt-0.5 flex-shrink-0">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ── DiDi Section ── */}
        {activeSection === 'didi' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <h3 className="font-bold text-[#484848] mb-4">How to Use DiDi in China</h3>
              <div className="space-y-4">
                {DIDI_STEPS.map((s) => (
                  <div key={s.step} className="flex gap-4">
                    <div className="w-8 h-8 bg-[#ff5a5f] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {s.step}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[#484848]">{s.icon} {s.title}</p>
                      <p className="text-xs text-[#767676] mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
              <p className="text-sm font-semibold text-yellow-800 mb-1">⚠️ Heads up</p>
              <p className="text-xs text-yellow-700">DiDi requires a Chinese phone number or international number with country code. Some features may need VPN outside China.</p>
            </div>
          </div>
        )}

        {/* ── Flights Section (FlyAI) ── */}
        {activeSection === 'flights' && (
          <div className="space-y-4">
            {/* Search form */}
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <h3 className="font-bold text-[#484848] mb-4">🛫 Search Flights</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[#767676] mb-1 block">From</label>
                  <select
                    value={flightFrom}
                    onChange={(e) => setFlightFrom(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a73e8] text-sm"
                  >
                    {FLIGHT_CITIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#767676] mb-1 block">To</label>
                  <select
                    value={flightTo}
                    onChange={(e) => setFlightTo(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a73e8] text-sm"
                  >
                    {FLIGHT_CITIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#767676] mb-1 block">Date</label>
                    <input
                      type="date"
                      lang="en"
                      value={flightDate}
                      onChange={(e) => setFlightDate(e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a73e8] text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#767676] mb-1 block">Passengers</label>
                    <select
                      value={flightPassengers}
                      onChange={(e) => setFlightPassengers(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a73e8] text-sm"
                    >
                      {[1,2,3,4,5,6].map((n) => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Adult' : 'Adults'}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleFlightSearch}
                  disabled={flightLoading}
                  className="w-full py-3 bg-gradient-to-r from-[#ff5a5f] to-[#ff3b3f] text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {flightLoading ? '🔍 Searching...' : '🔍 Search Flights'}
                </button>
              </div>
            </div>

            {/* Popular routes */}
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <h4 className="font-semibold text-sm text-[#484848] mb-3">✈️ Popular Routes</h4>
              <div className="space-y-2">
                {POPULAR_FLIGHTS.map((route) => (
                  <button
                    key={route.label}
                    onClick={() => { setFlightFrom(route.from); setFlightTo(route.to); setFlightSearched(false); setFlightResults([]); }}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl hover:bg-teal-50 hover:border-teal-200 border border-transparent transition-all text-sm"
                  >
                    <span className="font-medium text-[#484848]">{route.label}</span>
                    <span className="text-[#ff5a5f] text-xs">Select →</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Loading skeletons */}
            {flightLoading && (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {/* Error message */}
            {flightError && !flightLoading && (
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                <p className="text-sm text-amber-700">{flightError}</p>
                <button
                  onClick={() => handleTripAffiliate('flight')}
                  className="mt-2 px-4 py-2 bg-[#ff5a5f] text-white text-xs rounded-full font-medium hover:bg-[#e63235] transition-colors"
                >
                  Book via Trip.com →
                </button>
              </div>
            )}

            {/* FlyAI results */}
            {!flightLoading && flightResults.length > 0 && (
              <div>
                <p className="text-xs text-[#767676] mb-2 font-medium">🛫 FlyAI Results ({flightResults.length} flights found)</p>
                <div className="space-y-3">
                  <AnimatePresence>
                    {flightResults.slice(0, 10).map((result, i) => (
                      <FlightCard key={result.segments[0]?.marketingTransportNo + i} result={result} index={i} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Empty state after search with no results */}
            {!flightLoading && flightSearched && flightResults.length === 0 && !flightError && (
              <div className="bg-white rounded-2xl shadow-md p-6 text-center border border-gray-100">
                <p className="text-sm text-[#767676] mb-3">No flights found for this route.</p>
                <button
                  onClick={() => handleTripAffiliate('flight')}
                  className="px-4 py-2 bg-[#ff5a5f] text-white text-xs rounded-full font-medium hover:bg-[#e63235] transition-colors"
                >
                  Try Trip.com →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Trains Section (FlyAI) ── */}
        {activeSection === 'trains' && (
          <div className="space-y-4">
            {/* Search form */}
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <h3 className="font-bold text-[#484848] mb-4">🚅 Search Trains</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[#767676] mb-1 block">From</label>
                  <input
                    type="text"
                    value={trainFrom}
                    onChange={(e) => setTrainFrom(e.target.value)}
                    placeholder="e.g. Beijing"
                    className="w-full px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a73e8] text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#767676] mb-1 block">To</label>
                  <input
                    type="text"
                    value={trainTo}
                    onChange={(e) => setTrainTo(e.target.value)}
                    placeholder="e.g. Shanghai"
                    className="w-full px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a73e8] text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#767676] mb-1 block">Date</label>
                  <input
                    type="date"
                    lang="en"
                    value={trainDate}
                    onChange={(e) => setTrainDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a73e8] text-sm"
                  />
                </div>
                <button
                  onClick={handleTrainSearch}
                  disabled={trainLoading}
                  className="w-full py-3 bg-gradient-to-r from-[#1a73e8] to-[#174ea6] text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {trainLoading ? '🔍 Searching...' : '🔍 Search Trains'}
                </button>
              </div>
            </div>

            {/* Popular routes */}
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <h4 className="font-semibold text-sm text-[#484848] mb-3">🚄 Popular Routes</h4>
              <div className="space-y-2">
                {POPULAR_TRAINS.map((route) => (
                  <button
                    key={route.label}
                    onClick={() => { setTrainFrom(route.from); setTrainTo(route.to); setTrainSearched(false); setTrainResults([]); }}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all text-sm"
                  >
                    <span className="font-medium text-[#484848]">{route.label}</span>
                    <span className="text-[#1a73e8] text-xs">Select →</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Loading skeletons */}
            {trainLoading && (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {/* Error / fallback message */}
            {trainError && !trainLoading && (
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                <p className="text-sm text-amber-700">{trainError}</p>
                <button
                  onClick={() => handleTripAffiliate('train')}
                  className="mt-2 px-4 py-2 bg-[#1a73e8] text-white text-xs rounded-full font-medium hover:bg-[#174ea6] transition-colors"
                >
                  Book via Trip.com →
                </button>
              </div>
            )}

            {/* FlyAI results */}
            {!trainLoading && trainResults.length > 0 && (
              <div>
                <p className="text-xs text-[#767676] mb-2 font-medium">🚅 FlyAI Results ({trainResults.length} trains found)</p>
                <div className="space-y-3">
                  <AnimatePresence>
                    {trainResults.slice(0, 10).map((result, i) => (
                      <TrainCard key={result.segments[0]?.marketingTransportNo + i} result={result} index={i} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!trainLoading && trainSearched && trainResults.length === 0 && !trainError && (
              <div className="bg-white rounded-2xl shadow-md p-6 text-center border border-gray-100">
                <p className="text-sm text-[#767676] mb-3">No trains found for this route.</p>
                <button
                  onClick={() => handleTripAffiliate('train')}
                  className="px-4 py-2 bg-[#1a73e8] text-white text-xs rounded-full font-medium hover:bg-[#174ea6] transition-colors"
                >
                  Try Trip.com →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── High-Speed Rail Guide Section ── */}
        {activeSection === 'rail' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <h3 className="font-bold text-[#484848] mb-4">High-Speed Rail Guide</h3>
              <div className="space-y-4">
                {RAIL_TIPS.map((tip, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="text-2xl flex-shrink-0">{tip.icon}</div>
                    <div>
                      <p className="font-semibold text-sm text-[#484848]">{tip.title}</p>
                      <p className="text-xs text-[#767676] mt-0.5">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
              <p className="text-sm font-semibold text-amber-800 mb-1">💡 Best booking apps</p>
              <p className="text-xs text-amber-700">Trip.com (English) or Ctrip — both support international passports and credit cards. Book 2–4 weeks ahead for popular routes.</p>
            </div>
          </div>
        )}

        {/* Essential Apps */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-base font-bold text-[#484848] mb-4">{t('TransportPage.essentialApps')}</h3>
          <div className="space-y-3">
            {[
              { name: 'DiDi', desc: 'Ride-hailing with English interface', icon: '🚕', badge: 'Must Have' },
              { name: 'Alipay', desc: 'Metro QR codes + payment', icon: '💳', badge: 'Must Have' },
              { name: 'Trip.com', desc: 'Train & flight booking in English', icon: '🚄', badge: 'Recommended' },
              { name: 'Maps.me', desc: 'Offline maps — works without internet', icon: '🗺️', badge: 'Useful' },
            ].map((app) => (
              <div key={app.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="text-2xl">{app.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-[#484848]">{app.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      app.badge === 'Must Have' ? 'bg-red-100 text-red-600' :
                      app.badge === 'Recommended' ? 'bg-amber-100 text-amber-600' :
                      'bg-gray-200 text-gray-600'
                    }`}>{app.badge}</span>
                  </div>
                  <p className="text-xs text-[#767676]">{app.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
