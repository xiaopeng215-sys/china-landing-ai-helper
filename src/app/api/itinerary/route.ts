import { NextRequest, NextResponse } from 'next/server';
import { ItineraryGenerator } from '@/lib/itinerary/generator';
import type { ItineraryRequest } from '@/lib/itinerary/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as ItineraryRequest;

    // Basic validation
    if (!body.destination || !body.duration || !body.nationality || !body.budget) {
      return NextResponse.json(
        { error: 'Missing required fields: destination, duration, nationality, budget' },
        { status: 400 }
      );
    }

    if (body.duration < 1 || body.duration > 14) {
      return NextResponse.json(
        { error: 'Duration must be between 1 and 14 days' },
        { status: 400 }
      );
    }

    const generator = new ItineraryGenerator();
    const itinerary = await generator.generate(body);

    return NextResponse.json(itinerary);
  } catch (error) {
    console.error('Itinerary generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate itinerary. Please try again.' },
      { status: 500 }
    );
  }
}
