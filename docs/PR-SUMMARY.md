## PR Summary

This pull request introduces the full Next.js App Router staging site for VersaCraft Solutions. Key additions include:

- A dedicated route group `app/(site)` with pages for the home, services, pricing, reviews, availability, payments, and contact.
- Global Basic Auth (enabled via `BASIC_AUTH_USER`/`BASIC_AUTH_PASS`) and `noindex` headers to protect staging.
- A Calendly embed that syncs with the owner’s Google Calendar for availability.
- Anonymized reviews loaded from a JSON file.
- Content separated into a Markdown document for easy editing.
- Documentation for booking and payments setup.
- CI workflow placeholder and TODOs for future improvements.

**Next Steps:**

1. Populate real anonymized reviews in `data/reviews.json`.
2. Provide final Basic Auth credentials on Vercel.
3. Merge this PR and verify the production deployment.
4. Add Stripe test keys and integrate the Payment Element.
5. Review copy and styling for brand consistency.