# First-version verification — 3 November 2026

## Passed

- `npm run check`: JavaScript syntax, local asset references in HTML and CSS, section and SVG anchors, unique HTML IDs, structured-data JSON and image-size budgets.
- Local HTTP preview returns status 200.
- In-app browser loaded the welcome screen, main page, self-hosted Manrope font and hero image.
- At the browser's narrow viewport (319 × 559 CSS pixels, with a 304px content area), the document had no horizontal overflow. A small-screen heading adjustment was then applied.
- Booking dialog opened from the header.
- Changing pick-up to 10 December 2026 updated the return field and its minimum to 11 December 2026.
- Selecting the SUV filter showed only the SUV category. Selecting All restored the full range.
- The SUV enquiry control selected “SUV & extra space” in the enquiry form.
- Escape dismissed the native enquiry dialog.
- Mobile navigation opened and closed after selecting Find us.
- The browser reported no JavaScript warnings or errors in the checked interaction sequence.

## Verification limits

- The in-app browser did not apply its desktop viewport override. A separate Windows Chrome check was stopped by the computer-use tool because it could not confidently verify the current browser URL. Desktop screenshot QA therefore remains incomplete.
- No enquiry was sent to the company. WhatsApp message construction is implemented locally; the visitor chooses to send it in WhatsApp. Delivery, actual availability and reservation handling have not been tested.
- The provided social handles, exact map business pin, real fleet and commercial terms require confirmation by the business.
- Reduced-motion rules, native form constraints and the no-JavaScript fallback are implemented; a full assistive-technology or cross-browser audit has not been performed.

## Bundled image sizes

- Hero: 159,234 bytes.
- Three vehicle-style images in one sprite: 87,314 bytes.
- Coastal road: 442,102 bytes.

All visual media and the font are served locally; the page has no third-party analytics, font-CDN or image-CDN dependency.
