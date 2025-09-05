# VersaCraft Solutions – Staging Site

This is a staging site for VersaCraft Solutions built with [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/). It implements basic authentication and explicit `noindex` headers to avoid accidental search engine indexing. 

## Project Structure

Key directories and files:

- `app/` — Next.js App Router pages and layouts. The `app/(site)` route group contains all user‑facing pages such as home, services, pricing, reviews, availability, payments, and contact.
- `components/` — Shared UI components like the header, footer, Calendly embed, and review list.
- `data/` — JSON data used by the site (e.g. anonymized reviews).
- `content/` — Markdown copy for easy editing of the hero text, service blurbs, and other site content.
- `docs/` — Internal documentation for booking and payments setup, as well as a pre‑written pull request summary.
- `middleware.ts` — Global middleware implementing optional Basic Auth. When `BASIC_AUTH_USER` and `BASIC_AUTH_PASS` environment variables are set, visitors must supply credentials.
- `public/robots.txt` — Disallows all crawlers; combined with the `X‑Robots‑Tag` header in `vercel.json` to ensure unindexable staging.

## Development

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

## Deployment

The project is configured for deployment on Vercel’s Hobby (free) plan. Set the following environment variables:

- `BASIC_AUTH_USER` – username for Basic Auth (e.g. `demo`)
- `BASIC_AUTH_PASS` – password for Basic Auth (e.g. `demo123`)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` – optional Stripe test publishable key
- `STRIPE_SECRET_KEY` – optional Stripe test secret key

See `docs/booking-setup.md` and `docs/payments-setup.md` for further instructions.
