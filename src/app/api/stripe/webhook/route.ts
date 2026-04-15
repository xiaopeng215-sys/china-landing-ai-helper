import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe/client';
import { createClient } from '@supabase/supabase-js';
import type Stripe from 'stripe';

// Must use raw body for Stripe signature verification
export const runtime = 'nodejs';

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase env vars missing');
  return createClient(url, key);
}

async function updateSubscriptionTier(userId: string, tier: string) {
  const supabase = getAdminSupabase();
  const { error } = await supabase
    .from('user_profiles')
    .upsert({ user_id: userId, subscription_tier: tier }, { onConflict: 'user_id' });
  if (error) throw error;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('[stripe/webhook] signature verification failed', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId ?? session.client_reference_id;
      const plan = session.metadata?.plan;

      if (userId && plan) {
        await updateSubscriptionTier(userId, plan);
        console.log(`[stripe/webhook] Updated ${userId} → ${plan}`);
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      if (userId) {
        await updateSubscriptionTier(userId, 'free');
        console.log(`[stripe/webhook] Downgraded ${userId} → free`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[stripe/webhook] handler error', err);
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 });
  }
}
