# Zabi Khan & Tasmiya Nawal — Wedding Invitation

Saturday, 14 November 2026 · Nikah 4:30 PM · Reception 7:00 PM onwards · Cosmion Clubhouse

Pure HTML / CSS / vanilla JS. No build step — upload the folder to any static host (Vercel, Netlify, GitHub Pages).

## Section order
1. Gate (Open Invitation) 2. Hero 3. Countdown 4. Groom 5. Bride + Quranic quote
6. Wedding Celebration 7. RSVP 8. Closing footer

## Things to do before sharing
1. **Google Sheets** (RSVP) URL goes in `js/config.js` → `sheetsUrl`. Until then RSVP shows an
   honest "not connected" message and saves nothing.
3. **Link previews** — in `index.html` replace `https://YOUR-DOMAIN/` (og:url,
   og:image, twitter:image, canonical) with the live site address.

## Editing
- Dates, venue, map link, countdown target: `js/config.js` (+ matching text in `index.html`).
- Countdown target is `2026-11-14T16:30:00+05:30` (4:30 PM IST) for every visitor.
- Music: `assets/music.mp3` (original track kept).
