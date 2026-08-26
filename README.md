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
│   │   ├── components/field-unit/ /field-unit page sections (one file each)
│   │   └── components/        Shared Header / Footer / Eyebrow
│   ├── private/               Gated assets — served only via API routes, never /public
│   └── public/assets/         Product images
├── project/                   Original Claude Design HTML/JSX prototype (reference)
├── DESIGN_HANDOFF.md          Claude Design's handoff notes
└── README.md
```

## Landing page sections

`Header`, `Hero`, `Marquee`, `Pillars`, `RunCycle`, `UseCases`, `Specs`, `FieldReports`, `Configurator`, `FinalCTA`, `Footer`.

The `Configurator` is a client component (tier + add-ons + mount → live total). Everything else renders on the server.

## `/field-unit`

A second, self-contained page built from the `Sitepulse Landing.dc.html` Claude Design
file. It pitches the **delivered monthly service** ($900/mo + $250 deposit) rather than the
outright hardware sale on `/`, so the two pages deliberately carry different propositions.
Linked from the shared header.

Sections, in order: `FieldUnitNav`, `FieldUnitHero`, `LoadMarquee`, `Comparison`,
`PowerCalculator`, `Addons`, `Coverage`, `HowItWorks`, `Faq`, `ReserveForm`,
`FieldUnitFooter` — all under `src/app/components/field-unit/`.

Only `PowerCalculator` and `ReserveForm` are client components. They share sizing state
through `SizingProvider`, so every section between them still renders on the server and
`/field-unit` is statically prerendered.

The power model — load catalog, watt/day math, verdict thresholds, pricing — lives in
`src/lib/site-power.ts`, ported from the design file's logic block.

### Known gaps carried over from the design

- **"How long between site visits?"** and the **ZIP / site** field are captured but don't
  feed the result. They don't in the design prototype either; deciding what they should do
  is a product call.
- `public/assets/unit-hero.jpg` is a **stand-in** (a copy of `product-front.jpg`). The
  design's own hero photo couldn't be exported intact. Drop the real file at that path —
  no code change needed.

## Reservations — two separate flows

The site has two deposit paths, with different prices. Don't collapse them without a
product decision.

| | Hardware (`/`) | Service (`/field-unit`) |
|---|---|---|
| UI | `Configurator` | `ReserveForm` |
| Deposit | `RESERVATION_DEPOSIT_USD` = **$100** | `FIELD_UNIT_DEPOSIT_USD` = **$250** |
| API | `POST /api/checkout` | `POST /api/reserve` |
| Returns to | `/reserve/success` | `/field-unit?reserved=<id>#reserve` |

`ReserveForm` is a four-step flow: contact + site → ops details → $250 deposit → confirmed.

- `POST /api/reserve` validates the enquiry, emails it (Resend, falling back to a server
  log like `/api/contact`), then creates a Stripe Checkout session and returns its URL.
- The design prototype collected a card number inline. **We don't** — Stripe's hosted
  checkout takes the card, which keeps this app out of PCI scope.
- `GET /api/reserve/confirm` verifies `payment_status` server-side before the confirmation
  step renders and the X purchase conversion fires.

## Hero videos

`Hero` (`/`) and the `/dji-dock` hero both render through `AmbientVideo`, a small
client component that shows the poster immediately and attaches `src` only after
`window.load` fires *and* the element scrolls into view.

Don't put a plain `<video autoPlay preload="auto">` back. Chrome — desktop and
Android — fetches the whole file as part of the initial navigation, so the tab
spinner keeps turning until the last byte lands. Safari defers that fetch, so the
stall is invisible on Mac/iPhone and very visible everywhere else.

## Known TODOs

- **Reservations aren't persisted.** The deposit goes through Stripe and the enquiry is
  emailed, but there's no datastore — Stripe's dashboard and the notification email are
  the only records.
- **EV Backup** — the EV-charger section and add-on were removed from the live site; the current unit (2,000 W / 4 kW peak) can't sustain Level 2 charging. Reintroduce when a higher-output unit ships. Prototype kept in `project/Sitepulse EV Backup.html` for reference.
- **"Talk to an engineer" / "Read the field report"** CTAs are dead links.
- **Dealers / footer links** — all `href="#"` for now.
- **Hero videos are badly oversized.** `hero.mp4` is 5.98 MB for a 10 s 1264×720
  loop (≈4.8 Mbps — roughly 6× the bitrate this needs); `dock-hero.mp4` is
  1.84 MB. Re-encode both (H.264 ~800 kbps + a WebM/AV1 source) to get them under
  ~1 MB. `AmbientVideo` keeps them off the critical path, but on a job-site
  connection they're still a slow, expensive download.
- **`/assets/dock-lifestyle.png` doesn't exist.** The `/dji-dock` hero referenced
  it as a poster and got a 404, so that video now has no poster and shows a black
  box until it loads. Export a frame from `dock-hero.mp4` to that path.
