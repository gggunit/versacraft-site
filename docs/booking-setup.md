# Booking Setup

This site uses Calendly to provide self‑service booking. The embed is configured in `components/CalendarEmbed.tsx` and points to the Calendly page at `https://calendly.com/german-gladkov`.

## Changing the booking provider

If you wish to switch to Cal.com or another provider:

1. Replace the `<Script>` and `<div>` embed in `components/CalendarEmbed.tsx` with the appropriate embed script and markup for your provider.
2. Update any notes in the copy (`content/copy.md`) mentioning Calendly or Google Calendar sync.
3. If your provider supports free/busy availability, ensure it is configured to sync with your calendars.
