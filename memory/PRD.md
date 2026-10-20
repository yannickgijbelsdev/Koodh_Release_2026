# Koodh — Onepager

## Original problem statement
"Ik heb de html en md toegevoegd, bouw het exact zo" — user uploaded `Koodh.html` (complete self-contained onepager) and `Koodh.md` (text export of the same content). Requirement: reproduce the site exactly as delivered.

## What the site is
Dark navy one-page marketing site for Koodh (Chiel van Gansewinkel & Yannick Gijbels), IT services in NL & BE:
- Sticky scroll-driven hero with 3D tunnel of floating panels, word-by-word text reveal
- Floating pill navigation (Services / Clara / Team / About / Let's talk)
- Trusted-by logos (Studio Wonderland, Radiogroep, Thomas More)
- Services bento: Website development, Microsoft 365, Xink signatures, Wi-Fi & networks, AI integration, IT management, On-site support — each with its own animated mini-interface
- Clara platforms section (Clara, Clara Frames, Clara Campaigns) linking to clr.koodh.com
- Team section with photos and tool badges
- About section with stats (15+ projects, 10+ years, 2 countries, 1M+ lines)
- Contact footer (info@koodh.com, payments@koodh.com, KVK 42066318)

## Architecture
- The uploaded HTML is fully self-contained (inline CSS, inline JS, base64 images/fonts via Google Fonts CDN). It is served verbatim as `/app/frontend/public/index.html` through the existing CRA dev server (port 3000).
- `/app/frontend/src/index.js` reduced to a no-op so the injected React bundle does not mount (no `#root` in the static page).
- Platform scripts (emergent-main.js + DataCloneError guard) re-injected into `<head>`.
- Backend (FastAPI, port 8001) untouched; the site needs no API or database.

## Implemented
- 2026-10-20: Exact 1:1 serve of Koodh.html; verified at 1366/768/375 px, all sections render, scroll animations work, no JS errors.
- 2026-10-20: Removed all Netherlands/Belgium (NL · BE) references on user request; stats grid rebalanced to 3 items.
- 2026-10-20: News feature via Clara API. Backend proxy `GET /api/news` and `GET /api/news/articles/{id}` (httpx, 60s cache, 404 passthrough) → `https://clr.koodh.com/api/news/koodh/koodh` + `/articles/{id}`. Home has a "News" section: horizontally scrollable banner row (3 cards visible + peek, snap scroll) with image/date/title, dock link, "All news" link. Separate pages: `/nieuws/` (overview grid) and `/nieuws/artikel/?id=<uuid>` (article detail rendering CMS body HTML, dark navy styled, real Koodh SVG logo in header). httpx added to requirements.txt.
- 2026-10-20: Clara "Visit ↗" buttons replaced with "Request a demo" buttons (mailto:info@koodh.com with per-product subject: Clara / Clara Frames / Clara Campaigns).
- 2026-10-20: News cards restyled as long Clara-style banners (sticky stack, big title left, photo in white circle, "Read more" pill right, alternating gradients). Applied on home and /nieuws/ overview.
- 2026-10-20: Team heading → "Meet our small team."; dates removed from news banners and article pages (article meta shows category only); subpages (/nieuws/, /nieuws/artikel/) now share the exact homepage chrome via /shared/chrome.css + /shared/chrome.js (floating dock menu, animated koodh logo mark, contact footer with 3D tunnel, linkbar, legal); dock links on subpages point to /#anchors.
- 2026-10-20: Hero eyebrow "Websites & IT" removed; hero pills now use the real brand icons from the team tools (beak mark for Websites, Microsoft 365, Xink, Ubiquiti UniFi, OpenAI).

## User personas
- Business owners in NL/BE looking for websites, Microsoft 365, networks, AI help.

## Backlog / next tasks
- P1: Contact form backend (currently mailto links only)
- P2: Dutch language version (site is English)
- P2: SEO meta/OG tags for sharing
