/**
 * FlyAI API Wrapper (Client-safe)
 * 机票/高铁查询封装
 * 通过 /api/flight 和 /api/train 中转调用 flyai CLI
 */

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

export interface SearchOptions {
  origin: string;
  destination?: string;
  depDate?: string; // YYYY-MM-DD
  backDate?: string;
  journeyType?: 1 | 2;
  seatClassName?: string;
  maxPrice?: number;
  sortType?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  depHourStart?: number;
  depHourEnd?: number;
  transportNo?: string;
}

const API_BASE = '';

// Build query string from options
function buildQuery(options: Record<string, any>): string {
  const params = new URLSearchParams();
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  return params.toString();
}

/**
 * 搜索机票 (via API Route)
 */
export async function searchFlights(options: SearchOptions): Promise<FlightResult[]> {
  const query = buildQuery({
    origin: options.origin,
    destination: options.destination,
    depDate: options.depDate,
    backDate: options.backDate,
    sortType: options.sortType || 3,
    maxPrice: options.maxPrice,
    seatClassName: options.seatClassName,
  });

  const res = await fetch(`${API_BASE}/api/flight?${query}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Flight search failed');
  }

  const data = await res.json();
  if (data.status !== 0) {
    throw new Error(data.message || 'Flight search failed');
  }

  return (data.data?.itemList || []).map((item: any): FlightResult => ({
    ticketPrice: item.ticketPrice,
    totalDuration: item.totalDuration,
    journeyType: item.journeys?.[0]?.journeyType || '',
    segments: item.journeys?.[0]?.segments || [],
    jumpUrl: item.jumpUrl,
  }));
}

/**
 * 搜索高铁 (via API Route)
 */
export async function searchTrains(options: SearchOptions): Promise<TrainResult[]> {
  const query = buildQuery({
    origin: options.origin,
    destination: options.destination,
    depDate: options.depDate,
    backDate: options.backDate,
    sortType: options.sortType || 3,
    maxPrice: options.maxPrice,
    seatClassName: options.seatClassName,
  });

  const res = await fetch(`${API_BASE}/api/train?${query}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Train search failed');
  }

  const data = await res.json();
  if (data.status !== 0) {
    throw new Error(data.message || 'Train search failed');
  }

  return (data.data?.itemList || []).map((item: any): TrainResult => ({
    price: item.price || item.adultPrice,
    totalDuration: item.totalDuration,
    journeyType: item.journeys?.[0]?.journeyType || '',
    segments: item.journeys?.[0]?.segments || [],
    jumpUrl: item.jumpUrl,
  }));
}
