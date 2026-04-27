import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to .env.local for dev or to your Vercel project for prod.",
    );
  }
  _stripe = new Stripe(key);
  return _stripe;
}

export const RESERVATION_DEPOSIT_USD = 100;
