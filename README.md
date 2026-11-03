# Auto Rental Kovaci

A modern English-language car rental website for Auto Rental Kovaci, based on Rruga Uzines in Krujë, Albania, near Tirana Airport.

## Run locally

Requires Node.js 18 or later. No dependency installation or build step is needed.

```sh
npm run dev
```

Open `http://127.0.0.1:4173`. To use a different port, set `PORT` in your environment.

```sh
npm run check
```

Deploy the contents of `dist/` to any static web host. The `.openai/hosting.json` manifest connects the private Sites preview.

## What is included

- Cinematic, skippable welcome screen with a circular “Start your trip” control. Viewed once per browser session; links to a specific section bypass the intro.
- Responsive English landing page in red, black, grey and white, with a new vector-friendly wordmark.
- Vehicle-style filters, date validation, mobile navigation, native booking and privacy dialogs, FAQ accordions, location and social links.
- Enquiry form that prepares a WhatsApp message. The visitor sends the message in WhatsApp; no message is sent automatically.
- Reduced-motion support, keyboard focus handling, accessible form labels, and a no-JavaScript contact fallback.
- Original AI-generated imagery stored locally as optimized WebP assets and a self-hosted open-source Manrope font.

## Business details used

Provided address: **Rruga Uzines, Krujë, Albania**.

Numbers transcribed from the supplied business card and normalized to Albania’s international prefix:

- Primary phone and WhatsApp: **+355 68 900 0860**
- Secondary phone: **+355 69 318 2553**
- Instagram/TikTok: **auto_rental_kovaci** (from the supplied image; account ownership and live status have not been independently verified).

## Confirm before a public launch

1. Confirm company spelling (Kovaci / Kovaçi), both numbers and social handles.
2. Supply the actual vehicle list, photos, specifications and approved prices. Current images and categories illustrate vehicle styles and explicitly do not promise inventory.
3. Confirm driver age, licence and ID requirements, deposits, payment methods, insurance, mileage/fuel policies, cross-border permission and cancellation terms. The site asks visitors to confirm these with the team.
4. Confirm exact collection arrangements, airport delivery availability and fees. The current page says the office is near the airport and asks visitors to arrange collection; it does not promise a terminal desk or free transfers.
5. Replace the general street-search link with a verified Google Maps business pin if available. The graphic is an explicitly labelled area illustration, not a geographic map.
6. Review privacy information for the final hosting environment and business data-handling process. The site adds no analytics or advertising cookies and stores only an intro-viewed flag in session storage.
7. Choose a public domain and change absolute Open Graph/structured-data URLs in `dist/index.html` if the host changes.

## Editing

- `dist/index.html`: copy, page sections, phone numbers, links, metadata.
- `dist/styles.css`: design, motion and responsive layout; palette variables at the top.
- `dist/app.js`: welcome, filters, menus, dates, dialogs, WhatsApp-message preparation.
- `dist/assets/`: bundled images and font.
- `docs/IMAGE-SOURCES.md`: generated imagery provenance and final prompts.
- `docs/VERIFICATION.md`: checks performed for the first version.

The site does not take payments, store reservation data or connect to a live inventory system. An enquiry is not a confirmed booking.
