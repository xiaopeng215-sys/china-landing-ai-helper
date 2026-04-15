import { NextRequest, NextResponse } from 'next/server';
import { getStripe, PLANS, PlanKey } from '@/lib/stripe/client';

export async function POST(req: NextRequest) {
  try {
    const { plan, userId } = await req.json() as { plan: PlanKey; userId: string };

    if (!plan || !userId) {
      return NextResponse.json({ error: 'Missing plan or userId' }, { status: 400 });
    }

    const planConfig = PLANS[plan];
    if (!planConfig) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

    const session = await getStripe().checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: planConfig.priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard?subscription=success&plan=${plan}`,
      cancel_url: `${appUrl}/pricing?subscription=cancelled`,
      metadata: { userId, plan },
      client_reference_id: userId,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[stripe/checkout]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
