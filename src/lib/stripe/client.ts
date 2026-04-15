import Stripe from 'stripe';

export type PlanKey = 'explorer' | 'pro';

export const PLANS: Record<PlanKey, { priceId: string; name: string; price: number }> = {
  explorer: {
    priceId: process.env.STRIPE_EXPLORER_PRICE_ID ?? '',
    name: 'Explorer',
    price: 9.9,
  },
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID ?? '',
    name: 'Pro',
    price: 19.9,
  },
};

// Lazy singleton — avoids build-time crash when env vars are absent
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
    _stripe = new Stripe(key, { apiVersion: '2024-12-18.acacia' });
  }
  return _stripe;
}

/** @deprecated Use getStripe() instead */
export const stripe = {
  get checkout() { return getStripe().checkout; },
  get webhooks() { return getStripe().webhooks; },
};
