import { sendToAI } from '@/lib/ai-client';
import { getVisaRequirements } from '@/lib/travel-skills/visa';
import { getPaymentGuide } from '@/lib/travel-skills/payment';
import { getTransportGuide } from '@/lib/travel-skills/transport';
import type { ItineraryRequest, Itinerary, DayPlan, Activity, Meal } from './types';

const BUDGET_LABELS = {
  budget: 'budget traveler (¥200-400/day)',
  mid: 'mid-range traveler (¥400-800/day)',
  luxury: 'luxury traveler (¥800+/day)',
};

function buildDayPrompt(day: number, request: ItineraryRequest): string {
  const { destination, duration, budget, interests, travelDates } = request;
  const dateHint = travelDates
    ? ` (Day ${day} of trip starting ${travelDates.start})`
    : ` (Day ${day} of ${duration})`;

  return `You are a professional China travel planner. Create a detailed Day ${day} itinerary for ${destination}${dateHint}.

Traveler profile:
- Budget: ${BUDGET_LABELS[budget]}
- Interests: ${interests.join(', ')}
- Nationality: ${request.nationality}

Return ONLY valid JSON matching this exact structure (no markdown, no extra text):
{
  "theme": "short theme for the day",
  "morning": [{"name":"","type":"attraction","duration":"","cost":"","address":"","tips":[],"bookingRequired":false}],
  "afternoon": [{"name":"","type":"attraction","duration":"","cost":"","address":"","tips":[],"bookingRequired":false}],
  "evening": [{"name":"","type":"experience","duration":"","cost":"","address":"","tips":[],"bookingRequired":false}],
  "meals": [{"name":"","type":"breakfast","restaurant":"","cost":"","address":"","tips":[]}],
  "transport": "transport advice for the day",
  "tips": ["tip1","tip2"],
  "estimatedCost": "¥XXX-XXX"
}

Include 2-3 activities per time slot and 3 meals. Be specific with real place names, addresses, and costs.`;
}

function parseDayPlan(raw: string, day: number, date?: string): DayPlan {
  // Strip markdown code fences if present
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  // Find first { to last }
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON found in response');

  const parsed = JSON.parse(cleaned.slice(start, end + 1));

  const toActivity = (a: any): Activity => ({
    name: a.name || '',
    type: a.type || 'attraction',
    duration: a.duration || '',
    cost: a.cost || '',
    address: a.address || '',
    tips: Array.isArray(a.tips) ? a.tips : [],
    bookingRequired: !!a.bookingRequired,
    bookingUrl: a.bookingUrl,
  });

  const toMeal = (m: any): Meal => ({
    name: m.name || '',
    type: m.type || 'lunch',
    restaurant: m.restaurant,
    cost: m.cost || '',
    address: m.address,
    tips: Array.isArray(m.tips) ? m.tips : [],
  });

  return {
    day,
    date,
    theme: parsed.theme || `Day ${day}`,
    morning: (parsed.morning || []).map(toActivity),
    afternoon: (parsed.afternoon || []).map(toActivity),
    evening: (parsed.evening || []).map(toActivity),
    meals: (parsed.meals || []).map(toMeal),
    transport: parsed.transport || '',
    tips: Array.isArray(parsed.tips) ? parsed.tips : [],
    estimatedCost: parsed.estimatedCost || '',
  };
}

function fallbackDayPlan(day: number, request: ItineraryRequest, date?: string): DayPlan {
  const { destination } = request;
  return {
    day,
    date,
    theme: `Explore ${destination} - Day ${day}`,
    morning: [
      {
        name: `${destination} City Walk`,
        type: 'attraction',
        duration: '2-3 hours',
        cost: 'Free',
        address: `${destination} city center`,
        tips: ['Start early to avoid crowds', 'Wear comfortable shoes'],
        bookingRequired: false,
      },
    ],
    afternoon: [
      {
        name: 'Local Market Visit',
        type: 'shopping',
        duration: '2 hours',
        cost: '¥50-200',
        address: `${destination} local market`,
        tips: ['Bargaining is common', 'Try local snacks'],
        bookingRequired: false,
      },
    ],
    evening: [
      {
        name: 'Night Food Street',
        type: 'food',
        duration: '1-2 hours',
        cost: '¥50-100',
        address: `${destination} night market`,
        tips: ['Try local specialties', 'Cash or Alipay accepted'],
        bookingRequired: false,
      },
    ],
    meals: [
      { name: 'Local Breakfast', type: 'breakfast', cost: '¥15-30', tips: [] },
      { name: 'Street Food Lunch', type: 'lunch', cost: '¥30-60', tips: [] },
      { name: 'Restaurant Dinner', type: 'dinner', cost: '¥60-150', tips: [] },
    ],
    transport: 'Use metro for main routes, Didi for convenience',
    tips: ['Download offline maps', 'Keep small change handy'],
    estimatedCost: '¥300-500',
  };
}

export class ItineraryGenerator {
  async generate(request: ItineraryRequest): Promise<Itinerary> {
    // Generate all days in parallel
    const dayPromises = Array.from({ length: request.duration }, (_, i) => {
      const day = i + 1;
      let date: string | undefined;
      if (request.travelDates?.start) {
        const d = new Date(request.travelDates.start);
        d.setDate(d.getDate() + i);
        date = d.toISOString().split('T')[0];
      }
      return this.generateDayPlan(day, request, date);
    });

    const days = await Promise.all(dayPromises);
    const itinerary: Itinerary = {
      id: `itin_${Date.now()}`,
      request,
      days,
      totalBudget: '',
      essentialTips: [],
      emergencyContacts: [],
      createdAt: Date.now(),
    };

    return this.enrichWithSkills(itinerary, request);
  }

  private async generateDayPlan(day: number, request: ItineraryRequest, date?: string): Promise<DayPlan> {
    try {
      const prompt = buildDayPrompt(day, request);
      const response = await sendToAI(
        [{ role: 'user', content: prompt }],
        { intent: 'itinerary' }
      );
      return parseDayPlan(response.content, day, date);
    } catch (err) {
      console.warn(`Day ${day} generation failed, using fallback:`, err);
      return fallbackDayPlan(day, request, date);
    }
  }

  private enrichWithSkills(itinerary: Itinerary, request: ItineraryRequest): Itinerary {
    const tips: string[] = [];
    const contacts: string[] = [
      '🚨 Emergency: 110 (Police), 120 (Ambulance), 119 (Fire)',
      '🏥 Tourist Hotline: 12301',
    ];

    // Visa tips
    try {
      const visa = getVisaRequirements(request.nationality);
      if (visa) {
        if (visa.visaFree) {
          tips.push(`✅ Visa-free entry for ${request.nationality} passport holders (${visa.maxStay})`);
        } else {
          tips.push(`📋 Visa required for ${request.nationality} — apply before travel`);
        }
      }
    } catch {}

    // Payment tips
    try {
      const payment = getPaymentGuide('alipay');
      if (payment?.setupSteps?.length) {
        tips.push('💳 Set up Alipay before arrival — accepts international cards');
      }
    } catch {}
    tips.push('💳 Download Alipay & WeChat Pay — essential for daily payments');

    // Transport tips
    try {
      const transport = getTransportGuide('metro');
      if (transport?.howToUse?.length) {
        tips.push(`🚇 Metro tip: ${transport.howToUse[0]}`);
      }
    } catch {}
    tips.push('🚇 Download Metro app + Didi for ride-hailing');
    tips.push('📶 Get a local SIM or international eSIM for data access');
    tips.push('🔒 Use VPN to access Google Maps, WhatsApp, etc.');

    // Budget summary
    const budgetMap = {
      budget: `¥${request.duration * 300}–${request.duration * 500} total (excl. flights & hotel)`,
      mid: `¥${request.duration * 600}–${request.duration * 1000} total (excl. flights & hotel)`,
      luxury: `¥${request.duration * 1200}–${request.duration * 2000} total (excl. flights & hotel)`,
    };

    return {
      ...itinerary,
      totalBudget: budgetMap[request.budget],
      essentialTips: tips,
      emergencyContacts: contacts,
    };
  }
}
