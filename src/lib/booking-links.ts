/**
 * 购买链接生成器 - Klook/携程/高德
 * China Landing AI Helper
 */

export interface BookingLink {
  type: 'book' | 'navigate' | 'info';
  provider: 'klook' | 'trip' | 'amap' | 'didi' | 'meituan';
  url: string;
  text: string;
  icon?: string;
}

export interface POI {
  name: string;
  nameEn?: string;
  type: 'attraction' | 'restaurant' | 'hotel' | 'shopping';
  location?: string;
  lat?: number;
  lng?: number;
}

/**
 * 生成 Klook 预订链接
 */
export function generateKlookLink(poi: POI): BookingLink {
  const query = encodeURIComponent(poi.nameEn || poi.name);
  return {
    type: 'book',
    provider: 'klook',
    url: `https://www.klook.com/zh-CN/search/?keyword=${query}`,
    text: 'Klook 预订',
    icon: '🎫'
  };
}

/**
 * 生成携程预订链接
 */
export function generateTripLink(poi: POI): BookingLink {
  const query = encodeURIComponent(poi.name);
  return {
    type: 'book',
    provider: 'trip',
    url: `https://www.trip.com/activities/search?keyword=${query}`,
    text: '携程预订',
    icon: '🎫'
  };
}

/**
 * 生成高德导航链接
 */
export function generateAmapLink(poi: POI): BookingLink {
  const query = encodeURIComponent(poi.name);
  return {
    type: 'navigate',
    provider: 'amap',
    url: `https://www.amap.com/search?query=${query}`,
    text: '高德导航',
    icon: '🗺️'
  };
}

/**
 * 生成滴滴打车链接
 */
export function generateDidiLink(location?: string): BookingLink {
  const dest = location ? encodeURIComponent(location) : '';
  return {
    type: 'navigate',
    provider: 'didi',
    url: `https://www.xiaojukeji.com/pc/taxi/?destination=${dest}`,
    text: '滴滴打车',
    icon: '🚗'
  };
}

/**
 * 生成美团链接
 */
export function generateMeituanLink(poi: POI): BookingLink {
  const query = encodeURIComponent(poi.name);
  return {
    type: 'info',
    provider: 'meituan',
    url: `https://www.meituan.com/search?keyword=${query}`,
    text: '美团详情',
    icon: '🍽️'
  };
}

/**
 * 为 POI 生成所有可用链接
 */
export function generateAllLinks(poi: POI): BookingLink[] {
  const links: BookingLink[] = [];
  
  // 根据类型生成链接
  if (poi.type === 'attraction') {
    links.push(generateKlookLink(poi));
    links.push(generateTripLink(poi));
  } else if (poi.type === 'restaurant') {
    links.push(generateMeituanLink(poi));
    links.push(generateTripLink(poi));
  } else if (poi.type === 'hotel') {
    links.push(generateTripLink(poi));
    links.push(generateKlookLink(poi));
  }
  
  // 所有类型都生成导航链接
  if (poi.lat && poi.lng) {
    links.push(generateAmapLink(poi));
    links.push(generateDidiLink(poi.location));
  }
  
  return links;
}

/**
 * 示例用法
 */
export function example() {
  const bund: POI = {
    name: '外滩',
    nameEn: 'The Bund',
    type: 'attraction',
    location: '上海市黄浦区',
    lat: 31.2405,
    lng: 121.4901
  };
  
  const links = generateAllLinks(bund);
  // 返回：
  // [
  //   { type: 'book', provider: 'klook', url: '...', text: 'Klook 预订' },
  //   { type: 'book', provider: 'trip', url: '...', text: '携程预订' },
  //   { type: 'navigate', provider: 'amap', url: '...', text: '高德导航' },
  //   { type: 'navigate', provider: 'didi', url: '...', text: '滴滴打车' }
  // ]
  
  return links;
}
