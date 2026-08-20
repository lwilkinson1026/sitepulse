# Sitepulse

Marketing site for Sitepulse — a 90-lb hybrid power system (1.54 kWh LFP battery + 2,000 W inverter + Starlink Mini + 79cc top-up engine) built for unattended remote operation.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** with CSS-first theming
- **Inter** + **JetBrains Mono** via `next/font/google`

## Getting started

```bash
cd web
npm install
npm run dev
```

Open <http://localhost:3000>.

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## Repository layout

```
.
├── web/                       Next.js app (the real site)
│   ├── src/app/
│   │   ├── page.tsx           Composes the landing-page sections
│   │   ├── layout.tsx         Root layout, fonts, metadata
│   │   ├── globals.css        Design tokens, keyframes, custom utilities
│   │   ├── components/landing/ Landing-page sections (one file each)
│   │   └── components/        Shared Header / Footer / Eyebrow used by subpages
│   ├── private/               Gated assets — served only via API routes, never /public
│   └── public/assets/         Product images
├── project/                   Original Claude Design HTML/JSX prototype (reference)
├── DESIGN_HANDOFF.md          Claude Design's handoff notes
└── README.md
```

## Landing page sections

Built from the `Sitepulse Landing.dc.html` Claude Design file. In order:

`LandingNav`, `LandingHero`, `LoadMarquee`, `Comparison`, `PowerCalculator`, `Addons`,
`Coverage`, `HowItWorks`, `Faq`, `ReserveForm`, `LandingFooter`.

Only `PowerCalculator` and `ReserveForm` are client components. They share sizing state
through `SizingProvider` (`components/landing/SizingContext.tsx`) so the reserve summary
reflects the calculator, while every section between them still renders on the server —
`/` is statically prerendered.

The power model itself — load catalog, watt/day math, verdict thresholds, pricing — lives
in `src/lib/site-power.ts`, ported from the design file's logic block.

### Known gaps carried over from the design

- **"How long between site visits?"** and the **ZIP / site** field are captured but don't
  feed the result. They don't in the design prototype either; deciding what they should do
  (compare the visit interval against the air-filter and tank intervals?) is a product call.
- `public/assets/unit-hero.jpg` is a **stand-in** (a copy of `product-front.jpg`). The
  design's own hero photo couldn't be exported intact. Drop the real file at that path —
  no code change needed.

## Reservations

`ReserveForm` is a four-step flow: contact + site → ops details → $250 deposit → confirmed.

- `POST /api/reserve` validates the enquiry, emails it (Resend, falling back to a server
  log like `/api/contact`), then creates a Stripe Checkout session and returns its URL.
- The design prototype collected a card number inline. **We don't** — Stripe's hosted
  checkout takes the card, which keeps this app out of PCI scope.
- Stripe returns the visitor to `/?reserved=<session_id>#reserve`. The form calls
  `GET /api/reserve/confirm`, which verifies `payment_status` server-side before showing
  the confirmation step and firing the X purchase conversion.
- The deposit is **$250** (`RESERVATION_DEPOSIT_USD` in `src/lib/stripe.ts`), up from $100.

The older tier + add-on flow (`/api/checkout` → `/reserve/success`) is still wired up, but
nothing on the landing page links to it now.

## Field guide (email-gated download)

`/field-guide` gates the printable field guide PDF behind an email address.

- The PDF lives at `web/private/sitepulse-field-guide.pdf` — **outside `public/`**, so it has no
  guessable public URL. `outputFileTracingIncludes` in `next.config.ts` ships it with the
  download route.
- `POST /api/field-guide` validates the email, records the lead (Resend if configured,
  otherwise a server log), and sets a signed, HTTP-only cookie.
- `GET /api/field-guide/download` verifies that cookie and streams the PDF. Without it,
  the request is redirected back to the gate.
- Set **`FIELD_GUIDE_SECRET`** (`openssl rand -hex 32`) locally and in Vercel. It signs the
  cookie; without it the app falls back to a per-process key and unlocks break across
  serverless instances.
- Linked from the footer (Support → Field Guide) and the Specs section CTA.

To replace the PDF, drop a new file at the same path — no code changes needed.

## Known TODOs

- **Reservations aren't persisted.** The deposit goes through Stripe and the enquiry is
  emailed, but there's no datastore — Stripe's dashboard and the notification email are
  the only records.
- **Superseded components.** `Hero`, `Marquee`, `Pillars`, `RunCycle`, `UseCases`, `Specs`,
  `FieldReports`, `Configurator`, and `FinalCTA` in `src/app/components/` are no longer
  imported by any page. Delete them once you're happy with the new landing page.
- **EV Backup** — the EV-charger section and add-on were removed from the live site; the current unit (2,000 W / 4 kW peak) can't sustain Level 2 charging. Reintroduce when a higher-output unit ships. Prototype kept in `project/Sitepulse EV Backup.html` for reference.
- **"Talk to an engineer" / "Read the field report"** CTAs are dead links.
- **Dealers / footer links** — all `href="#"` for now.
