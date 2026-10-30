/**
 * ============================================================
 *  WEDDING CONFIGURATION — ZABI KHAN & TASMIYA NAWAL
 *  Edit this file to update wedding details across the site
 * ============================================================
 */
window.WEDDING_CONFIG = {

  /* ── SEO & METADATA ─────────────────────────────────────── */
  seo: {
    title:        'Zabi Khan & Tasmiya Nawal | Wedding Invitation',
    description:  'With the blessings of Allah, join us in celebrating the wedding of Zabi Khan & Tasmiya Nawal — Saturday, 14 November 2026 at Cosmion Clubhouse.',
    ogImage:      'og-image.jpg',
    themeColor:   '#C8A96A',
  },

  /* ── COUPLE ─────────────────────────────────────────────── */
  groom: { firstName: 'Zabi',    displayName: 'Zabi Khan',     fullName: 'Zabiulla Khan', role: 'The Groom' },
  bride: { firstName: 'Tasmiya', displayName: 'Tasmiya Nawal', fullName: 'Tasmiya Nawal', role: 'The Bride' },
  monogram: 'Z & T',

  /* ── DATES ───────────────────────────────────────────────── */
  dates: {
    display: 'Saturday, 14 November 2026',
  },

  /* ── COUNTDOWN ───────────────────────────────────────────── */
  /* Nikah starts 4:30 PM India Standard Time (UTC+05:30) */
  countdown: {
    nikah: {
      label:  'Nikah',
      target: '2026-11-14T16:30:00+05:30',
    },
  },

  /* ── EVENT ───────────────────────────────────────────────── */
  event: {
    nikahTime:     '4:30 PM',
    receptionTime: '7:00 PM Onwards',
    venue:         'Cosmion Clubhouse',
    mapsUrl:       'https://share.google/fdWynbbs2lURDu5iL',
  },

  /* ── MUSIC ───────────────────────────────────────────────── */
  music: {
    src:    'assets/music.mp3',
    volume: 0.45,
  },

  /* ── RSVP → GOOGLE SHEETS ────────────────────────────────────
     Paste your Google Apps Script Web App URL here (same one the
     original site used). RSVPs are posted to it as JSON.          */
  sheetsUrl: 'https://script.google.com/macros/s/AKfycbyNiLnZbY2Xdw6lS4f_19eTjh8GWKTZPIAANYT2HDRxfEz-7YihUCVE50ALrVxh2b_DpQ/exec',

};
