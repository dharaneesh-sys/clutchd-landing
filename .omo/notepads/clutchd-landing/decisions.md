# ClutchD Landing — Decisions

## 2026-08-14
- Phase 2 production plan direction (user-confirmed): form backend = form service now (Netlify Forms if Netlify, Formspree if Vercel); analytics = Plausible (cookieless — note: no free tier, 30-day trial then $9/mo; GoatCounter/Umami are the free alternatives, reconfirm at execution); hosting = Netlify recommended, Vercel alternative (user asked "can i use netlify or vercel" — yes, both; Netlify bundles Forms + _headers + redirects); deliverable = plan document only (PRODUCTION.md), no code changed. NOTE: "custom domain deferred to launch planning" is a recommendation (user didn't confirm), not a decision.

## 2026-08-13
- T13 deploy target: GitHub Pages (tailnet server offline; gh authed as dharaneesh-sys).
- Wave 1 file-conflict decomposition: T2/T5/T6 all touch Hero.jsx → T2 (pricing) + T5 (form) sequential; T6 creates TrustBar.jsx + removes inline trust line from Hero.jsx after T5. T3/T4/T6 wire into App.jsx → single wiring task after components exist.
- FAQ nav link: footer only (nav already 6 items, crowded).
- Testimonials placement: after Trust section in App.jsx.
