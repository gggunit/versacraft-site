# Payments Setup

The `/payments` page currently contains a placeholder panel describing a future Stripe Payment Element. To enable payments:

1. Create a free Stripe account in test mode.
2. Obtain your **publishable** and **secret** test keys from the Stripe dashboard.
3. Set `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY` in your Vercel environment variables.
4. Replace the placeholder content in `app/(site)/payments/page.tsx` with an implementation of Stripe’s [Payment Element](https://stripe.com/docs/payments/payment-element) using the test keys.

When you are ready to go live, generate live keys in Stripe and update the environment variables accordingly.