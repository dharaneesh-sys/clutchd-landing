/**
 * Wave XII-1 (PRODUCTION.md): English string map — the i18n baseline.
 *
 * KEY CONVENTION (flat + stable, one level only):
 *   - Every key is a single-level string key on this object. No nested
 *     objects — `ta.js` is a pure string-map swap, so it must be able to
 *     mirror this file 1:1.
 *   - Named items use dot-flat keys: `nav.howItWorks`, `hero.headline`.
 *   - Repeated items use array-index keys: `trustBar.0.title`,
 *     `faq.0.q`, `workflow.2.body`. Indexes are stable (they mirror the
 *     source component's array order).
 *   - `{placeholder}` values (e.g. `heroStage.stepAriaLabel`) are
 *     templates; the consumer substitutes the placeholder at render time.
 *
 * SOURCE OF TRUTH: every string below is copied verbatim from the rendered
 * copy in src/components + src/pages (post Wave XIII em-dash cleanup — no
 * em-dashes in visible copy). Meta titles/descriptions are included under
 * `meta.*` because they are user-visible (browser tab / search results).
 */
export default {
  // --- App shell ---
  'app.skipToContent': 'Skip to content',

  // --- Brand wordmark (src/components/brand/Logo.jsx) — proper noun, kept
  // in the map so the raw-string gate stays clean and ta.js can override. ---
  'brand.wordmark': 'Clutch',
  'brand.wordmarkAccent': 'D',

  // --- Header (src/components/layout/Header.jsx) ---
  'nav.howItWorks': 'How it works',
  'nav.marketplace': 'Marketplace',
  'nav.forProviders': 'For providers',
  'nav.faq': 'FAQ',
  'nav.cta': 'Get early access',
  'nav.logoAriaLabel': 'ClutchD home',
  'nav.primaryAriaLabel': 'Primary',
  'nav.openMenuAriaLabel': 'Open menu',
  'nav.closeMenuAriaLabel': 'Close menu',
  'nav.langAriaLabel': 'Language',
  'nav.langEn': 'EN',
  'nav.langTa': 'தமிழ்',

  // --- Mobile menu (src/components/layout/MobileMenu.jsx) ---
  'mobileMenu.dialogAriaLabel': 'Site menu',
  'mobileMenu.navAriaLabel': 'Mobile',
  'mobileMenu.cta': 'Get early access',

  // --- Footer (src/components/layout/Footer.jsx) ---
  'footer.nav.home': 'Home',
  'footer.nav.howItWorks': 'How it works',
  'footer.nav.marketplace': 'Marketplace',
  'footer.nav.forProviders': 'For providers',
  'footer.nav.faq': 'FAQ',
  'footer.nav.earlyAccess': 'Early access',
  'footer.tagline':
    'ClutchD connects drivers, mechanics, garages, fleets, parts, payments and service history into one automotive ecosystem.',
  'footer.navAriaLabel': 'Footer',
  'footer.copyright': '© 2026 ClutchD',
  'footer.tamilComingSoon': 'தமிழ் இப்போது கிடைக்கிறது: Tamil now available',
  'footer.privacy': 'Privacy',
  'footer.terms': 'Terms',

  // --- Hero (src/components/sections/Hero.jsx) ---
  'hero.liveBadge': 'Now live in Coimbatore',
  'hero.headline': 'One connected ecosystem for automotive care.',
  'hero.subtext':
    'Find verified mechanics, request roadside help, source the right parts, track work live, and keep your complete service history.',
  'hero.cta': 'How it works',

  // --- TrustBar (src/components/sections/TrustBar.jsx) ---
  'trustBar.0.title': 'Verified providers',
  'trustBar.0.sub': 'Every provider passes identity and skill checks.',
  'trustBar.1.title': 'Transparent estimates',
  'trustBar.1.sub': 'See the price before the work starts.',
  'trustBar.2.title': 'Secure payments',
  'trustBar.2.sub': 'Pay through the platform: protected and receipt-backed.',

  // --- Audiences (src/components/sections/Audiences.jsx) ---
  'audiences.eyebrow': "WHO IT'S FOR",
  'audiences.title': 'Built for everyone who keeps vehicles moving',
  'audiences.lede': 'One ecosystem, four perspectives: all working from the same verified network.',
  'audiences.0.overline': 'Nº01 · Primary audience',
  'audiences.1.overline': 'Nº02 · Service provider',
  'audiences.2.overline': 'Nº03 · Workshop',
  'audiences.3.overline': 'Nº04 · Fleet operator',
  'audiences.0.title': 'Drivers',
  'audiences.0.bullets.0': 'Find verified mechanics nearby',
  'audiences.0.bullets.1': 'Request service or roadside help',
  'audiences.0.bullets.2': 'Track arrival with live ETA',
  'audiences.0.bullets.3': 'Approve estimates, pay securely',
  'audiences.0.bullets.4': 'Digital service history & maintenance reminders',
  'audiences.0.bullets.5': 'Buy parts in the marketplace',
  'audiences.1.title': 'Mechanics',
  'audiences.1.bullets.0': 'Get discovered & receive jobs',
  'audiences.1.bullets.1': 'Manage schedules & track jobs',
  'audiences.1.bullets.2': 'Earn and track earnings',
  'audiences.1.bullets.3': 'Build ratings & reputation',
  'audiences.1.bullets.4': 'Grow a customer base',
  'audiences.2.title': 'Garages',
  'audiences.2.bullets.0': 'Customers, jobs & appointments',
  'audiences.2.bullets.1': 'Mechanics & team',
  'audiences.2.bullets.2': 'Inventory & spare parts',
  'audiences.2.bullets.3': 'Billing & revenue analytics',
  'audiences.3.title': 'Fleets',
  'audiences.3.bullets.0': 'Monitor vehicles & health',
  'audiences.3.bullets.1': 'Schedule maintenance',
  'audiences.3.bullets.2': 'Manage drivers',
  'audiences.3.bullets.3': 'Predictive maintenance & fleet analytics',
  'audiences.3.bullets.4': 'Cut downtime',

  // --- Ecosystem (src/components/sections/Ecosystem.jsx) ---
  'ecosystem.eyebrow': 'THE ECOSYSTEM',
  'ecosystem.title': 'Every service, connected',
  'ecosystem.lede':
    "ClutchD puts drivers, mechanics, garages, fleets, parts, payments and service history on one system, so the vehicle's story never starts over.",
  'ecosystem.0.node': 'Driver',
  'ecosystem.1.node': 'Vehicle',
  'ecosystem.2.node': 'Service Request',
  'ecosystem.3.node': 'Mechanic',
  'ecosystem.4.node': 'Garage',
  'ecosystem.5.node': 'Parts',
  'ecosystem.6.node': 'Payment',
  'ecosystem.7.node': 'Service History',
  'ecosystem.8.node': 'Vehicle Intelligence',
  'ecosystem.hint': 'Hover a node to see how it connects to the next step in the chain.',
  'ecosystem.connectsToNext': 'Connects to next step',

  // --- Workflow (src/components/sections/Workflow.jsx) ---
  'workflow.eyebrow': 'HOW IT WORKS',
  'workflow.title': 'From breakdown to back on the road',
  'workflow.lede':
    "Six real job states, from the moment you request help to the moment your vehicle's history is updated.",
  'workflow.0.title': 'Request',
  'workflow.0.body': 'Share the problem and your location.',
  'workflow.1.title': 'Match',
  'workflow.1.body': 'ClutchD finds verified nearby providers.',
  'workflow.1.label': 'Searching',
  'workflow.2.title': 'Accept',
  'workflow.2.body': 'A mechanic takes the job.',
  'workflow.2.label': 'Accepted',
  'workflow.3.title': 'En route',
  'workflow.3.body': 'Track arrival with live ETA.',
  'workflow.3.label': 'En route',
  'workflow.4.title': 'In progress',
  'workflow.4.body': 'Approve the estimate as the work happens.',
  'workflow.4.label': 'In progress',
  'workflow.5.title': 'Done',
  'workflow.5.body':
    "Pay securely, review, and the service joins your vehicle's digital history.",
  'workflow.5.label': 'Completed',

  // --- Trust (src/components/sections/Trust.jsx) ---
  'trust.eyebrow': 'TRUST',
  'trust.title': "Know exactly who you're dealing with",
  'trust.lede': 'Five commitments that make automotive care something you can rely on.',
  'trust.0.tag': 'KYC',
  'trust.0.title': 'Verified mechanics & garages',
  'trust.0.body':
    'Every provider passes identity and skill verification (KYC) before they join the network.',
  'trust.1.tag': 'ESTIMATE',
  'trust.1.title': 'Transparent estimates',
  'trust.1.body': 'See the price before the work starts. Approve the estimate, then the wrench lifts.',
  'trust.2.tag': 'RATINGS',
  'trust.2.title': 'Ratings & reviews',
  'trust.2.body': 'Real feedback from real jobs keeps the network honest and accountable.',
  'trust.3.tag': 'PAYMENTS',
  'trust.3.title': 'Secure payments',
  'trust.3.body': 'Pay through the platform with Stripe and Razorpay: protected and receipt-backed.',
  'trust.4.tag': 'RECORDS',
  'trust.4.title': 'Digital service records',
  'trust.4.body': "Your vehicle's history lives on the vehicle, not in a drawer of paper invoices.",
  'trust.estimate.title': 'Estimate',
  'trust.estimate.previewBadge': 'Preview',
  'trust.estimate.labour': 'Labour',
  'trust.estimate.labourValue': '₹850',
  'trust.estimate.parts': 'Parts',
  'trust.estimate.partsValue': '₹1,200',
  'trust.estimate.total': 'Total',
  'trust.estimate.totalValue': '₹2,050',
  'trust.estimate.approved': 'Approved',

  // --- Testimonials (src/components/sections/Testimonials.jsx) ---
  'testimonials.eyebrow': 'PROOF',
  'testimonials.title': 'People on the road, in their own words',
  'testimonials.lede': 'What drivers, mechanics and garages say about working on the ClutchD network.',
  'testimonials.statsLabel': 'Launch figures pending: illustrative',
  'testimonials.statsAriaLabel': 'Illustrative launch figures, not production metrics',
  'testimonials.0.value': '120+',
  'testimonials.0.label': 'Verified mechanics',
  'testimonials.1.value': '35+',
  'testimonials.1.label': 'Partner garages',
  'testimonials.2.value': '12k+',
  'testimonials.2.label': 'Service records',
  'testimonials.3.value': '~18 min',
  'testimonials.3.label': 'Avg response time',
  'testimonials.quote.0.name': 'Ravi K',
  'testimonials.quote.0.role': 'Two-wheeler owner · Coimbatore',
  'testimonials.quote.0.quote':
    'My bike broke down on Trichy Road: a verified mechanic was at my spot in under twenty minutes. I watched the whole thing on the live map.',
  'testimonials.quote.1.name': 'Mohammed Irfan',
  'testimonials.quote.1.role': 'Verified mechanic · Chennai',
  'testimonials.quote.1.quote':
    "ClutchD brings me jobs I'd never reach on my own. Customers already know my rating before they call.",
  'testimonials.quote.2.name': 'Deepa Nair',
  'testimonials.quote.2.role': 'Garage operator · Kochi',
  'testimonials.quote.2.quote':
    'Estimates, approvals, payment: it all lands in one place now. My desk stopped being a filing cabinet.',

  // --- Marketplace (src/components/sections/Marketplace.jsx) ---
  'marketplace.eyebrow': 'MARKETPLACE',
  'marketplace.title': 'Service and parts, on the same system',
  'marketplace.lede':
    'Diagnose → find the required parts → check availability → order → get it serviced → keep the record. One workflow, no hopping between apps.',
  'marketplace.0.category': 'Engine Parts',
  'marketplace.1.category': 'Brake Parts',
  'marketplace.2.category': 'Electrical Components',
  'marketplace.3.category': 'Suspension Parts',
  'marketplace.4.category': 'Filters',
  'marketplace.5.category': 'Accessories',
  'marketplace.callout.0.title': 'Fitment check',
  'marketplace.callout.0.body':
    'Pick your make, model, and year, and only see parts that actually fit your vehicle.',
  'marketplace.callout.1.title': 'Vendor comparison',
  'marketplace.callout.1.body':
    'Compare prices across verified suppliers before you order: no more phoning around.',
  'marketplace.catalog.partNo': 'Part № CD-1042',
  'marketplace.catalog.previewBadge': 'Preview',
  'marketplace.catalog.title': 'Brake pads, front',
  'marketplace.catalog.price': 'from ₹1,200',
  'marketplace.catalog.fits': 'Fits your vehicle',
  'marketplace.catalog.rating': '4.8',

  // --- Intelligence (src/components/sections/Intelligence.jsx) ---
  'intelligence.eyebrow': 'INTELLIGENCE',
  'intelligence.title': 'Maintenance that happens before things break',
  'intelligence.lede':
    'From reactive breakdowns to proactive care, ClutchD turns vehicle data into early warnings and planned service.',
  'intelligence.0.title': 'Maintenance reminders',
  'intelligence.0.body': 'Service records turn into future needs: you get told before it becomes a problem.',
  'intelligence.1.title': 'Vehicle health insights',
  'intelligence.1.body': "A live view of your vehicle's systems, from battery to brakes.",
  'intelligence.2.title': 'Predictive maintenance & early warnings',
  'intelligence.2.body': 'Anomalies in the data flag issues early, so you act before a breakdown.',
  'intelligence.3.title': 'Fleet intelligence',
  'intelligence.3.body':
    'For fleets: proactive scheduling and health monitoring replace reactive firefighting.',
  'intelligence.healthCard.title': 'Vehicle health',
  'intelligence.healthCard.previewBadge': 'Preview',
  'intelligence.healthCard.battery': 'Battery',
  'intelligence.healthCard.batteryValue': '78%',
  'intelligence.healthCard.batteryStatus': 'healthy',
  'intelligence.healthCard.brakeWear': 'Brake wear',
  'intelligence.healthCard.brakeWearValue': '62%',
  'intelligence.healthCard.brakeWearStatus': 'due soon',
  'intelligence.healthCard.nextService': 'Next service',
  'intelligence.healthCard.nextServiceValue': 'in 2 months',

  // --- FAQ (src/components/sections/Faq.jsx) ---
  'faq.eyebrow': 'FAQ',
  'faq.title': 'Questions, answered',
  'faq.lede': 'Everything you need to know about how ClutchD works before you book.',
  'faq.0.q': 'How does ClutchD matching work?',
  'faq.0.a':
    'ClutchD finds verified nearby providers for your request, and you can track the match in real time.',
  'faq.1.q': 'How do estimates and pricing work?',
  'faq.1.a': 'You see the price before work starts and approve the estimate before the wrench lifts.',
  'faq.2.q': 'How are providers verified?',
  'faq.2.a':
    'Every mechanic and garage passes identity and skill verification (KYC) before joining the network.',
  'faq.3.q': 'Where is ClutchD available?',
  'faq.3.a': 'Currently rolling out in Coimbatore, with more cities planned.',
  'faq.4.q': 'What payment methods are supported?',
  'faq.4.a': 'Pay securely through the platform with Stripe and Razorpay.',
  'faq.5.q': 'What does "Preview" mean?',
  'faq.5.a':
    'Some screens and figures on this page are illustrative previews of the product; real numbers update as ClutchD rolls out.',

  // --- EarlyAccess section (src/components/sections/EarlyAccess.jsx) ---
  'earlyAccess.eyebrow': 'EARLY ACCESS',
  'earlyAccess.title': 'ClutchD is rolling out in Coimbatore',
  'earlyAccess.lede': 'Be among the first to try one connected ecosystem for automotive care.',

  // --- EarlyAccessForm (src/components/ui/EarlyAccessForm.jsx) ---
  'form.emailLabel': 'Email address',
  'form.emailPlaceholder': 'you@example.com',
  'form.submit': 'Get early access',
  'form.submitting': 'Submitting…',
  'form.validationError': 'Enter a valid email address',
  'form.error': 'Something went wrong. Please try again.',
  'form.success': "You're on the list. We'll email you when ClutchD opens near you.",
  'form.duplicate': "You're already on the list. We'll email you when ClutchD opens near you.",
  'form.legal': "We'll only email you about the Coimbatore launch.",
  'form.privacyLink': 'Privacy policy',

  // --- PrivacyNotice (src/components/ui/PrivacyNotice.jsx) ---
  'privacyNotice.ariaLabel': 'Privacy notice',
  'privacyNotice.body':
    'ClutchD uses GoatCounter, a cookie-free analytics tool, to count page views. No personal data is collected.',
  'privacyNotice.privacyLink': 'Privacy policy',
  'privacyNotice.dismiss': 'Got it',

  // --- NotFound (src/pages/NotFound.jsx) ---
  'notFound.metaTitle': 'Page not found: ClutchD',
  'notFound.metaDescription':
    "The page you're looking for doesn't exist or has moved. Head back home to keep exploring ClutchD.",
  'notFound.code': 'Error 404',
  'notFound.title': 'This page took a wrong turn.',
  'notFound.body':
    "The page you're looking for doesn't exist or has moved. Head back home to keep exploring ClutchD.",
  'notFound.backHome': 'Back home',

  // --- RouteFallback (src/components/ui/RouteFallback.jsx) ---
  'routeFallback.loading': 'Loading',

  // --- Page meta (src/pages/*.jsx, via usePageMeta) ---
  'meta.home.title': 'ClutchD: Connected automotive care',
  'meta.home.description':
    'On-demand verified mechanics, roadside help, parts marketplace, real-time tracking and digital service history: one connected automotive ecosystem, live in Coimbatore.',
  'meta.howItWorks.title': 'How it works: ClutchD',
  'meta.howItWorks.description':
    'See how ClutchD connects you with verified mechanics in minutes: from service request to completed work, with real-time tracking at every step.',
  'meta.marketplace.title': 'Marketplace: ClutchD',
  'meta.marketplace.description':
    'Browse the ClutchD marketplace: parts categories, fitment checks and verified vendors for your vehicle, with transparent estimates.',
  'meta.forProviders.title': 'For providers: ClutchD',
  'meta.forProviders.description':
    'Grow your business with ClutchD: verified leads, transparent pricing and reliable payments for mechanics, garages and fleets.',
  'meta.faq.title': 'FAQ: ClutchD',
  'meta.faq.description':
    'Straight answers about how ClutchD works: matching, estimates, verification, coverage, payments and what Preview means.',
  'meta.earlyAccess.title': 'Early access: ClutchD',
  'meta.earlyAccess.description':
    'Join the ClutchD early-access waitlist and be first in line when the app opens in your city.',

  // --- Page headers (src/pages/*.jsx) ---
  'page.howItWorks.eyebrow': 'The platform',
  'page.howItWorks.title': 'How it works',
  'page.howItWorks.body':
    'From request to completed service, see how ClutchD connects you with verified providers in minutes.',
  'page.marketplace.eyebrow': 'The marketplace',
  'page.marketplace.title': 'Marketplace',
  'page.marketplace.body':
    'Browse verified providers, transparent estimates, and real-time availability across the ecosystem.',
  'page.forProviders.eyebrow': 'Provider network',
  'page.forProviders.title': 'For providers',
  'page.forProviders.body':
    'Grow your business with verified leads, transparent pricing, and payments you can rely on.',
  'page.faq.eyebrow': 'Support',
  'page.faq.title': 'FAQ',
  'page.faq.body': 'Straight answers about how ClutchD works, what it costs, and how your data is handled.',
  'page.earlyAccess.eyebrow': 'Get started',
  'page.earlyAccess.title': 'Early access',
  'page.earlyAccess.body': 'Join the waitlist and be first in line when ClutchD opens in your city.',

  // --- HeroStage (src/components/ui/HeroStage.jsx) ---
  'heroStage.0.step': 'Request',
  'heroStage.1.step': 'Searching',
  'heroStage.2.step': 'Accepted',
  'heroStage.3.step': 'En route',
  'heroStage.4.step': 'In progress',
  'heroStage.5.step': 'Completed',
  'heroStage.0.header': 'Service request',
  'heroStage.1.header': 'Searching for verified mechanics…',
  'heroStage.2.header': 'Mechanic accepted',
  'heroStage.3.header': 'Mechanic en route',
  'heroStage.4.header': 'Work in progress',
  'heroStage.5.header': 'Service completed',
  'heroStage.eta.2.label': 'Arriving in',
  'heroStage.eta.2.value': '18 min',
  'heroStage.eta.3.label': 'Arriving in',
  'heroStage.eta.3.value': '12 min',
  'heroStage.eta.4.label': 'Remaining',
  'heroStage.eta.4.value': '6 min',
  'heroStage.0.announcement': 'Status: Request. Waiting for your service request.',
  'heroStage.1.announcement': 'Status: Searching, searching for verified mechanics.',
  'heroStage.2.announcement': 'Status: Accepted. Rahul K. accepted the job. Arriving in 18 minutes.',
  'heroStage.3.announcement': 'Status: En route. Mechanic arriving in 12 minutes.',
  'heroStage.4.announcement':
    'Status: In progress. Brake pad replacement underway. Estimated ₹1,450.',
  'heroStage.5.announcement': 'Status: Completed. Service complete.',
  'heroStage.legend': 'Demo status steps',
  'heroStage.stepAriaLabel': 'Show {title} state (step {n})',
  'heroStage.previewBadge': 'Preview',
  'heroStage.serviceComplete': 'Service complete',
  'heroStage.allDone': 'All done',
  'heroStage.mechanicInitials': 'RK',
  'heroStage.mechanicName': 'Rahul K.',
  'heroStage.mechanicRating': '4.9 · Verified',
  'heroStage.verifiedBadge': 'Verified',
  'heroStage.jobTitle': 'Brake pad replacement',
  'heroStage.estimate': 'Est. ₹1,450',
}