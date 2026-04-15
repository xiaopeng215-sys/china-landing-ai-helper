import { NextRequest, NextResponse } from 'next/server';
import { buildItineraryHTML } from '@/lib/itinerary/pdf-generator';
import type { ItineraryRoute } from '@/data/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { itinerary, format } = body as { itinerary: ItineraryRoute; format: 'pdf' | 'html' };

    if (!itinerary || !format) {
      return NextResponse.json({ error: 'Missing itinerary or format' }, { status: 400 });
    }

    const html = buildItineraryHTML(itinerary);

    if (format === 'html') {
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Disposition': `inline; filename="${itinerary.cityEn}-itinerary.html"`,
        },
      });
    }

    // PDF: return the HTML for client-side rendering
    // (jsPDF runs client-side; this endpoint provides the HTML source)
    return NextResponse.json({ html, filename: `${itinerary.cityEn}-${itinerary.days}day-itinerary.pdf` });
  } catch (err) {
    console.error('[itinerary/export]', err);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
