# VersaCraft — Scheduling Portal & Services (Staging)

Private staging site (noindex + Basic Auth) for German's services.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Vercel (Hobby)
- Calendly embed
- Stripe (test placeholder)

## Getting Started

```bash
# Install deps
npm install

# Dev
npm run dev
# Build
npm run build
# Start
npm run start
```

## Environment
Copy `.env.example` → `.env.local` (for local dev) and set on Vercel:

- `BASIC_AUTH_USER`, `BASIC_AUTH_PASS`
- (optional) `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`

## Staging Privacy
- `middleware.ts` enforces Basic Auth when envs are present.
- `vercel.json` sets `X-Robots-Tag: noindex, nofollow`.
- `public/robots.txt` disallows all crawling.

## Deployment (Vercel)
1. Create or open your Vercel project.
2. Import this GitHub repo; set the project root to `/` and framework to Next.js.
3. Set environment variables.
4. Deploy; confirm Basic Auth dialog and noindex headers.

## Branching
- Create `design-refresh` branch for work; open PR to `main`.

## Calendly
Embed is at `/availability`. Change URL in `components/CalendarEmbed.tsx` to switch providers.

## Payments
Stripe test placeholder at `/payments`. For a real flow, add Stripe Elements and server routes.
