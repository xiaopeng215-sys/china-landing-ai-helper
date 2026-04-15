export interface MapPoint {
  id: string;
  name: string;
  nameEn: string;
  lat: number;
  lng: number;
  type: 'attraction' | 'food' | 'hotel' | 'transport';
  description: string;
  city: string;
}

export const CITIES = [
  { id: 'beijing', name: 'Beijing', nameZh: '北京', lat: 39.9042, lng: 116.4074 },
  { id: 'shanghai', name: 'Shanghai', nameZh: '上海', lat: 31.2304, lng: 121.4737 },
  { id: 'chengdu', name: 'Chengdu', nameZh: '成都', lat: 30.5728, lng: 104.0668 },
  { id: 'xian', name: "Xi'an", nameZh: '西安', lat: 34.3416, lng: 108.9398 },
];

export const MAP_POINTS: MapPoint[] = [
  // ── Beijing ──────────────────────────────────────────────────────────────
  { id: 'bj-1', city: 'beijing', type: 'attraction', name: '故宫', nameEn: 'Forbidden City', lat: 39.9163, lng: 116.3972, description: 'Imperial palace of the Ming and Qing dynasties. Must-book tickets in advance.' },
  { id: 'bj-2', city: 'beijing', type: 'attraction', name: '天安门广场', nameEn: 'Tiananmen Square', lat: 39.9055, lng: 116.3976, description: 'One of the largest public squares in the world, iconic landmark.' },
  { id: 'bj-3', city: 'beijing', type: 'attraction', name: '天坛', nameEn: 'Temple of Heaven', lat: 39.8822, lng: 116.4066, description: 'Ming dynasty ceremonial complex. Beautiful park for morning tai chi.' },
  { id: 'bj-4', city: 'beijing', type: 'attraction', name: '颐和园', nameEn: 'Summer Palace', lat: 39.9999, lng: 116.2755, description: 'Stunning imperial garden with Kunming Lake and Longevity Hill.' },
  { id: 'bj-5', city: 'beijing', type: 'attraction', name: '八达岭长城', nameEn: 'Great Wall (Badaling)', lat: 40.3544, lng: 116.0199, description: 'Most visited section of the Great Wall, ~80km from city center.' },
  { id: 'bj-6', city: 'beijing', type: 'attraction', name: '北京奥林匹克公园', nameEn: 'Olympic Park', lat: 40.0089, lng: 116.3914, description: 'Bird\'s Nest stadium and Water Cube from 2008 Olympics.' },
  { id: 'bj-7', city: 'beijing', type: 'food', name: '全聚德烤鸭', nameEn: 'Quanjude Peking Duck', lat: 39.9012, lng: 116.3975, description: 'Famous century-old Peking Duck restaurant. Book ahead.' },
  { id: 'bj-8', city: 'beijing', type: 'food', name: '南锣鼓巷', nameEn: 'Nanluoguxiang Hutong', lat: 39.9368, lng: 116.4009, description: 'Historic hutong alley packed with street food and cafes.' },
  { id: 'bj-9', city: 'beijing', type: 'transport', name: '北京首都国际机场', nameEn: 'Beijing Capital Airport (PEK)', lat: 40.0799, lng: 116.6031, description: 'Main international airport. Airport Express to city: 30 min, ¥25.' },
  { id: 'bj-10', city: 'beijing', type: 'transport', name: '北京大兴国际机场', nameEn: 'Beijing Daxing Airport (PKX)', lat: 39.5098, lng: 116.4105, description: 'New airport south of city. Express train to city: 35 min.' },
  { id: 'bj-11', city: 'beijing', type: 'transport', name: '北京西站', nameEn: 'Beijing West Railway Station', lat: 39.8983, lng: 116.3222, description: 'Major HSR hub for trains to Xi\'an, Chengdu, and south China.' },
  { id: 'bj-12', city: 'beijing', type: 'attraction', name: '雍和宫', nameEn: 'Lama Temple', lat: 39.9474, lng: 116.4133, description: 'Largest Tibetan Buddhist temple outside Tibet. Stunning architecture.' },
  { id: 'bj-13', city: 'beijing', type: 'attraction', name: '北海公园', nameEn: 'Beihai Park', lat: 39.9258, lng: 116.3878, description: 'Imperial garden with White Pagoda, great for a relaxing afternoon.' },

  // ── Shanghai ──────────────────────────────────────────────────────────────
  { id: 'sh-1', city: 'shanghai', type: 'attraction', name: '外滩', nameEn: 'The Bund', lat: 31.2397, lng: 121.4900, description: 'Iconic waterfront promenade with colonial architecture and Pudong skyline views.' },
  { id: 'sh-2', city: 'shanghai', type: 'attraction', name: '东方明珠塔', nameEn: 'Oriental Pearl Tower', lat: 31.2397, lng: 121.4997, description: 'Iconic 468m TV tower with observation decks and city views.' },
  { id: 'sh-3', city: 'shanghai', type: 'attraction', name: '豫园', nameEn: 'Yu Garden', lat: 31.2274, lng: 121.4927, description: 'Classical Ming dynasty garden in the heart of Old Shanghai.' },
  { id: 'sh-4', city: 'shanghai', type: 'attraction', name: '上海迪士尼乐园', nameEn: 'Shanghai Disneyland', lat: 31.1440, lng: 121.6570, description: 'Largest Disney park in Asia. Book tickets and FastPass in advance.' },
  { id: 'sh-5', city: 'shanghai', type: 'attraction', name: '田子坊', nameEn: 'Tianzifang', lat: 31.2148, lng: 121.4680, description: 'Artsy labyrinth of lanes with boutiques, cafes, and galleries.' },
  { id: 'sh-6', city: 'shanghai', type: 'attraction', name: '上海博物馆', nameEn: 'Shanghai Museum', lat: 31.2296, lng: 121.4737, description: 'World-class collection of Chinese art and antiquities. Free entry.' },
  { id: 'sh-7', city: 'shanghai', type: 'food', name: '南翔馒头店', nameEn: 'Nanxiang Xiaolongbao', lat: 31.2278, lng: 121.4930, description: 'Famous soup dumpling shop in Yu Garden. Expect queues.' },
  { id: 'sh-8', city: 'shanghai', type: 'food', name: '新天地', nameEn: 'Xintiandi', lat: 31.2196, lng: 121.4737, description: 'Upscale dining and nightlife district in restored shikumen buildings.' },
  { id: 'sh-9', city: 'shanghai', type: 'transport', name: '上海浦东国际机场', nameEn: 'Pudong Airport (PVG)', lat: 31.1443, lng: 121.8083, description: 'Main international airport. Maglev to city: 8 min, ¥50.' },
  { id: 'sh-10', city: 'shanghai', type: 'transport', name: '上海虹桥枢纽', nameEn: 'Hongqiao Hub (SHA/HSR)', lat: 31.1979, lng: 121.3368, description: 'Combined airport + HSR station. Trains to Beijing: 4.5h.' },
  { id: 'sh-11', city: 'shanghai', type: 'attraction', name: '上海中心大厦', nameEn: 'Shanghai Tower', lat: 31.2357, lng: 121.5013, description: 'China\'s tallest building at 632m. Observation deck on 118F.' },
  { id: 'sh-12', city: 'shanghai', type: 'attraction', name: '朱家角古镇', nameEn: 'Zhujiajiao Water Town', lat: 31.1133, lng: 121.0622, description: 'Ancient water town with canals and stone bridges, 1h from city.' },

  // ── Chengdu ──────────────────────────────────────────────────────────────
  { id: 'cd-1', city: 'chengdu', type: 'attraction', name: '成都大熊猫繁育研究基地', nameEn: 'Giant Panda Base', lat: 30.7369, lng: 104.1490, description: 'Best place to see giant pandas. Go early morning for most activity.' },
  { id: 'cd-2', city: 'chengdu', type: 'attraction', name: '宽窄巷子', nameEn: 'Kuanzhai Alley', lat: 30.6726, lng: 104.0574, description: 'Historic alley complex with teahouses, street food, and Sichuan culture.' },
  { id: 'cd-3', city: 'chengdu', type: 'attraction', name: '武侯祠', nameEn: 'Wuhou Shrine', lat: 30.6427, lng: 104.0449, description: 'Memorial to Zhuge Liang and Liu Bei from the Three Kingdoms era.' },
  { id: 'cd-4', city: 'chengdu', type: 'attraction', name: '锦里古街', nameEn: 'Jinli Ancient Street', lat: 30.6413, lng: 104.0479, description: 'Lively pedestrian street next to Wuhou Shrine, great for snacks.' },
  { id: 'cd-5', city: 'chengdu', type: 'attraction', name: '都江堰', nameEn: 'Dujiangyan Irrigation System', lat: 30.9956, lng: 103.6170, description: '2,000-year-old UNESCO irrigation system, 1h from Chengdu.' },
  { id: 'cd-6', city: 'chengdu', type: 'food', name: '海底捞火锅', nameEn: 'Haidilao Hot Pot', lat: 30.6598, lng: 104.0647, description: 'Famous Sichuan hot pot chain known for exceptional service.' },
  { id: 'cd-7', city: 'chengdu', type: 'food', name: '龙抄手', nameEn: 'Long Chaoshou (Wontons)', lat: 30.6598, lng: 104.0647, description: 'Classic Chengdu wonton restaurant, a local institution since 1941.' },
  { id: 'cd-8', city: 'chengdu', type: 'transport', name: '成都天府国际机场', nameEn: 'Chengdu Tianfu Airport (TFU)', lat: 30.3232, lng: 104.4441, description: 'New main airport. Metro Line 18 to city: 40 min.' },
  { id: 'cd-9', city: 'chengdu', type: 'transport', name: '成都东站', nameEn: 'Chengdu East Railway Station', lat: 30.6244, lng: 104.1415, description: 'Main HSR station. Trains to Xi\'an: 3.5h, Beijing: 8h.' },
  { id: 'cd-10', city: 'chengdu', type: 'attraction', name: '青城山', nameEn: 'Qingcheng Mountain', lat: 30.9003, lng: 103.5718, description: 'Taoist sacred mountain with ancient temples and lush forests.' },
  { id: 'cd-11', city: 'chengdu', type: 'attraction', name: '成都博物馆', nameEn: 'Chengdu Museum', lat: 30.6667, lng: 104.0614, description: 'Free museum showcasing Sichuan history and culture.' },
  { id: 'cd-12', city: 'chengdu', type: 'food', name: '陈麻婆豆腐', nameEn: 'Chen Mapo Tofu (Original)', lat: 30.6741, lng: 104.0614, description: 'The original Mapo Tofu restaurant, founded in 1862. A must-try.' },

  // ── Xi'an ──────────────────────────────────────────────────────────────
  { id: 'xa-1', city: 'xian', type: 'attraction', name: '秦始皇兵马俑', nameEn: 'Terracotta Army', lat: 34.3845, lng: 109.2784, description: 'UNESCO World Heritage Site. 8,000+ life-size clay soldiers. Book tickets online.' },
  { id: 'xa-2', city: 'xian', type: 'attraction', name: '西安城墙', nameEn: "Xi'an City Wall", lat: 34.2583, lng: 108.9286, description: 'Best-preserved ancient city wall in China. Rent a bike and ride the top.' },
  { id: 'xa-3', city: 'xian', type: 'attraction', name: '大雁塔', nameEn: 'Big Wild Goose Pagoda', lat: 34.2228, lng: 108.9598, description: 'Tang dynasty Buddhist pagoda, 64m tall. Beautiful surrounding park.' },
  { id: 'xa-4', city: 'xian', type: 'attraction', name: '回民街', nameEn: 'Muslim Quarter', lat: 34.2667, lng: 108.9400, description: 'Vibrant street market with Hui Muslim food and culture. Try roujiamo!' },
  { id: 'xa-5', city: 'xian', type: 'attraction', name: '华清宫', nameEn: 'Huaqing Palace', lat: 34.3617, lng: 109.2133, description: 'Imperial hot spring resort with Tang dynasty history and light shows.' },
  { id: 'xa-6', city: 'xian', type: 'attraction', name: '陕西历史博物馆', nameEn: 'Shaanxi History Museum', lat: 34.2228, lng: 108.9598, description: 'One of China\'s best museums. Free entry (book online). Tang artifacts.' },
  { id: 'xa-7', city: 'xian', type: 'food', name: '老孙家羊肉泡馍', nameEn: 'Lao Sun Jia (Paomo)', lat: 34.2667, lng: 108.9450, description: 'Famous restaurant for paomo — bread soaked in lamb broth. A Xi\'an staple.' },
  { id: 'xa-8', city: 'xian', type: 'food', name: '贾三灌汤包', nameEn: 'Jia San Soup Dumplings', lat: 34.2667, lng: 108.9380, description: 'Legendary soup dumplings in the Muslim Quarter. Always a queue.' },
  { id: 'xa-9', city: 'xian', type: 'transport', name: '西安咸阳国际机场', nameEn: "Xi'an Xianyang Airport (XIY)", lat: 34.4471, lng: 108.7516, description: 'Main airport. Airport bus to city: 40 min, ¥30.' },
  { id: 'xa-10', city: 'xian', type: 'transport', name: '西安北站', nameEn: "Xi'an North Railway Station", lat: 34.3786, lng: 108.9229, description: 'HSR station. Trains to Beijing: 4.5h, Chengdu: 3.5h.' },
  { id: 'xa-11', city: 'xian', type: 'attraction', name: '小雁塔', nameEn: 'Small Wild Goose Pagoda', lat: 34.2500, lng: 108.9500, description: 'Elegant Tang pagoda in a peaceful park, less crowded than Big Goose.' },
  { id: 'xa-12', city: 'xian', type: 'attraction', name: '钟楼', nameEn: 'Bell Tower', lat: 34.2583, lng: 108.9400, description: 'Iconic Ming dynasty bell tower at the heart of Xi\'an city.' },
];

export const TYPE_COLORS: Record<MapPoint['type'], string> = {
  attraction: '#10B981',
  food: '#F59E0B',
  hotel: '#6366F1',
  transport: '#3B82F6',
};

export const TYPE_LABELS: Record<MapPoint['type'], string> = {
  attraction: '🏛️ Attraction',
  food: '🍜 Food',
  hotel: '🏨 Hotel',
  transport: '🚇 Transport',
};
