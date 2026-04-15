import type { TravelerProfile } from '@/lib/traveler-profile';
import { attractionLink, tourLink, hotelSearchLink } from '@/lib/affiliate';

export interface Recommendation {
  id: string;
  type: 'attraction' | 'food' | 'hotel' | 'experience' | 'tip';
  title: string;
  description: string;
  city: string;
  imageUrl?: string;
  relevanceScore: number; // 0-1
  tags: string[];
  actionUrl?: string; // affiliate link
}

// ── Static recommendation pool ────────────────────────────────────────────────

const ALL_RECOMMENDATIONS: Recommendation[] = [
  // Beijing
  {
    id: 'bj-great-wall',
    type: 'attraction',
    title: 'Great Wall at Mutianyu',
    description: 'Less crowded section with stunning views. Cable car available — skip the Badaling crowds.',
    city: 'Beijing',
    imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80',
    relevanceScore: 0.9,
    tags: ['history', 'nature', 'photography'],
    actionUrl: attractionLink('beijing'),
  },
  {
    id: 'bj-hutong-food',
    type: 'food',
    title: 'Hutong Street Food Tour',
    description: 'Wander Nanluoguxiang for jianbing, lamb skewers, and traditional snacks under ¥50.',
    city: 'Beijing',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80',
    relevanceScore: 0.85,
    tags: ['food', 'history', 'budget'],
    actionUrl: tourLink('beijing'),
  },
  {
    id: 'bj-hotel-mid',
    type: 'hotel',
    title: 'Stay Near Wangfujing',
    description: 'Central location, easy metro access to Forbidden City and Tiananmen. Mid-range options from ¥300/night.',
    city: 'Beijing',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    relevanceScore: 0.8,
    tags: ['hotel', 'central', 'mid-range'],
    actionUrl: hotelSearchLink('beijing'),
  },
  {
    id: 'bj-temple-heaven',
    type: 'attraction',
    title: 'Temple of Heaven at Dawn',
    description: 'Arrive early to watch locals do tai chi and play erhu. Free with Beijing through-train ticket.',
    city: 'Beijing',
    imageUrl: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80',
    relevanceScore: 0.75,
    tags: ['history', 'spirituality', 'photography'],
    actionUrl: attractionLink('beijing'),
  },

  // Shanghai
  {
    id: 'sh-bund-night',
    type: 'attraction',
    title: 'The Bund at Night',
    description: 'Free waterfront promenade with the best skyline views. Go after 8pm when the lights come on.',
    city: 'Shanghai',
    imageUrl: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=800&q=80',
    relevanceScore: 0.9,
    tags: ['photography', 'nightlife', 'free'],
    actionUrl: attractionLink('shanghai'),
  },
  {
    id: 'sh-xiaolongbao',
    type: 'food',
    title: 'Xiaolongbao at Nanxiang',
    description: 'The original soup dumpling shop in Yu Garden. Queue early — worth every minute of the wait.',
    city: 'Shanghai',
    imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&q=80',
    relevanceScore: 0.88,
    tags: ['food', 'local', 'must-try'],
    actionUrl: tourLink('shanghai'),
  },
  {
    id: 'sh-french-concession',
    type: 'experience',
    title: 'French Concession Walk',
    description: 'Tree-lined streets, indie cafés, and boutique shops. Best neighbourhood for a lazy afternoon.',
    city: 'Shanghai',
    imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
    relevanceScore: 0.82,
    tags: ['art & culture', 'shopping', 'photography'],
    actionUrl: tourLink('shanghai'),
  },
  {
    id: 'sh-hotel-luxury',
    type: 'hotel',
    title: 'Luxury Stay on the Bund',
    description: 'Iconic hotels with Pudong skyline views. The Peninsula and Waldorf Astoria both deliver.',
    city: 'Shanghai',
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
    relevanceScore: 0.7,
    tags: ['hotel', 'luxury', 'bund'],
    actionUrl: hotelSearchLink('shanghai'),
  },

  // Chengdu
  {
    id: 'cd-panda-base',
    type: 'attraction',
    title: 'Giant Panda Base',
    description: 'Arrive at 8am to see pandas at feeding time. Book tickets online — sells out fast on weekends.',
    city: 'Chengdu',
    imageUrl: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&q=80',
    relevanceScore: 0.95,
    tags: ['nature', 'photography', 'family'],
    actionUrl: attractionLink('chengdu'),
  },
  {
    id: 'cd-hotpot',
    type: 'food',
    title: 'Authentic Sichuan Hot Pot',
    description: 'Haidilao is tourist-friendly with English menus. For locals, try Shu Jiuxiang near Chunxi Road.',
    city: 'Chengdu',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80',
    relevanceScore: 0.9,
    tags: ['food', 'spicy', 'local'],
    actionUrl: tourLink('chengdu'),
  },
  {
    id: 'cd-jinli',
    type: 'experience',
    title: 'Jinli Ancient Street',
    description: 'Traditional Sichuan architecture, street snacks, and shadow puppet shows. Free to enter.',
    city: 'Chengdu',
    imageUrl: 'https://images.unsplash.com/photo-1537531383496-f4755a5e3d3e?w=800&q=80',
    relevanceScore: 0.8,
    tags: ['history', 'food', 'art & culture'],
    actionUrl: tourLink('chengdu'),
  },
  {
    id: 'cd-teahouse',
    type: 'tip',
    title: 'Teahouse Culture in People\'s Park',
    description: 'Sit in a bamboo chair, order a ¥20 tea, and watch locals play mahjong for hours. Pure Chengdu.',
    city: 'Chengdu',
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80',
    relevanceScore: 0.75,
    tags: ['art & culture', 'budget', 'local'],
    actionUrl: tourLink('chengdu'),
  },

  // Xi'an
  {
    id: 'xa-terracotta',
    type: 'attraction',
    title: 'Terracotta Warriors',
    description: 'One of the world\'s greatest archaeological sites. Hire a guide — context makes it 10x better.',
    city: "Xi'an",
    imageUrl: 'https://images.unsplash.com/photo-1591543620767-582b2e76369e?w=800&q=80',
    relevanceScore: 0.95,
    tags: ['history', 'photography'],
    actionUrl: attractionLink('xian'),
  },
  {
    id: 'xa-muslim-quarter',
    type: 'food',
    title: 'Muslim Quarter Night Market',
    description: 'Roujiamo (Chinese burger), yangrou paomo, and biangbiang noodles. Halal-friendly and incredible.',
    city: "Xi'an",
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    relevanceScore: 0.88,
    tags: ['food', 'halal', 'history', 'nightlife'],
    actionUrl: tourLink('xian'),
  },

  // Guilin
  {
    id: 'gl-li-river',
    type: 'experience',
    title: 'Li River Cruise',
    description: 'The karst landscape on the ¥100 note. Take the cruise from Guilin to Yangshuo for the full experience.',
    city: 'Guilin',
    imageUrl: 'https://images.unsplash.com/photo-1537531383496-f4755a5e3d3e?w=800&q=80',
    relevanceScore: 0.92,
    tags: ['nature', 'photography'],
    actionUrl: tourLink('guilin'),
  },
  {
    id: 'gl-rice-terraces',
    type: 'attraction',
    title: 'Longji Rice Terraces',
    description: 'Stunning terraced hillsides, best in spring (green) or autumn (golden). 2h from Guilin by bus.',
    city: 'Guilin',
    imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
    relevanceScore: 0.85,
    tags: ['nature', 'photography', 'hiking'],
    actionUrl: attractionLink('guilin'),
  },

  // Hangzhou
  {
    id: 'hz-west-lake',
    type: 'attraction',
    title: 'West Lake Sunrise Walk',
    description: 'Free to walk around. Rent a bike (¥5/hr) and circle the lake at dawn before the crowds arrive.',
    city: 'Hangzhou',
    imageUrl: 'https://images.unsplash.com/photo-1537531383496-f4755a5e3d3e?w=800&q=80',
    relevanceScore: 0.9,
    tags: ['nature', 'photography', 'budget'],
    actionUrl: attractionLink('hangzhou'),
  },
  {
    id: 'hz-longjing-tea',
    type: 'experience',
    title: 'Longjing Tea Village',
    description: 'Visit the source of Dragon Well tea. Pick leaves in season (March-April) and taste fresh-roasted tea.',
    city: 'Hangzhou',
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80',
    relevanceScore: 0.82,
    tags: ['art & culture', 'nature', 'food'],
    actionUrl: tourLink('hangzhou'),
  },
];

// ── Interest → tag mapping ────────────────────────────────────────────────────

const INTEREST_TAG_MAP: Record<string, string[]> = {
  history: ['history', 'heritage'],
  food: ['food', 'local', 'must-try', 'spicy', 'halal'],
  nature: ['nature', 'hiking', 'outdoor'],
  'art & culture': ['art & culture', 'local'],
  shopping: ['shopping'],
  nightlife: ['nightlife'],
  spirituality: ['spirituality'],
  photography: ['photography'],
};

// ── Scoring ───────────────────────────────────────────────────────────────────

function scoreRecommendation(rec: Recommendation, profile: TravelerProfile): number {
  let score = rec.relevanceScore;

  // City match boost
  const cityMatch = profile.plannedCities.some(
    c => c.toLowerCase() === rec.city.toLowerCase()
  );
  if (cityMatch) score += 0.3;

  // Interest match boost
  const interestTags = profile.preferences.interests.flatMap(
    i => INTEREST_TAG_MAP[i] ?? [i]
  );
  const tagMatches = rec.tags.filter(t => interestTags.includes(t)).length;
  score += tagMatches * 0.1;

  // Budget filter
  if (profile.preferences.budget === 'budget' && rec.tags.includes('luxury')) score -= 0.4;
  if (profile.preferences.budget === 'luxury' && rec.tags.includes('budget')) score -= 0.2;

  // Food restriction: halal boost
  if (
    profile.preferences.foodRestrictions.includes('halal') &&
    rec.tags.includes('halal')
  ) score += 0.2;

  return Math.min(score, 1);
}

// ── Default popular picks (no profile) ───────────────────────────────────────

const DEFAULT_IDS = [
  'bj-great-wall',
  'bj-hutong-food',
  'sh-bund-night',
  'sh-xiaolongbao',
  'cd-panda-base',
  'cd-hotpot',
];

// ── Public API ────────────────────────────────────────────────────────────────

export function getPersonalizedRecommendations(
  profile: TravelerProfile | null,
  limit = 6
): Recommendation[] {
  if (!profile || (profile.plannedCities.length === 0 && profile.preferences.interests.length === 0)) {
    return ALL_RECOMMENDATIONS.filter(r => DEFAULT_IDS.includes(r.id)).slice(0, limit);
  }

  const scored = ALL_RECOMMENDATIONS.map(rec => ({
    ...rec,
    relevanceScore: scoreRecommendation(rec, profile),
  }));

  return scored
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);
}
