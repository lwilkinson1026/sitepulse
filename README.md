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

## Ad attribution

UTM params and click IDs (`fbclid`, `gclid`, `twclid`) are stored first-touch and last-touch in the `sp_attr` cookie, attached to Stripe checkout metadata, and included on team notification emails.

Meta Pixel + Conversions API and PostHog are **opt-in via env vars** — if the vars are unset, nothing extra loads. The existing X (Twitter) pixel stays on. See `web/.env.example` for `NEXT_PUBLIC_META_PIXEL_ID`, `META_CAPI_ACCESS_TOKEN`, `META_CAPI_TEST_EVENT_CODE`, `NEXT_PUBLIC_POSTHOG_KEY`, and `NEXT_PUBLIC_POSTHOG_HOST`.

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

`Header`, `Hero`, `Marquee`, `Pillars`, `RunCycle`, `UseCases`, `Specs`, `FieldReports`, `RentalOffer`, `FinalCTA`, `Footer`.

`RentalOffer` (`/#rent`) shows the two plans: the $299/mo rental (links to `/rent`) and fuel service by the gallon (links to `/contact`). The site no longer sells hardware — the old `Configurator` and its $100 deposit checkout were removed.

## `/field-unit`

A second, self-contained page built from the `Sitepulse Landing.dc.html` Claude Design
file, aimed at instrument / monitoring sites. It carries the same rental offer as the rest
of the site and sends people to `/rent`.

Sections, in order: `FieldUnitNav`, `FieldUnitHero`, `LoadMarquee`, `Comparison`,
`PowerCalculator`, `Coverage`, `HowItWorks`, `Faq`, `RentCta`, `FieldUnitFooter` — all
under `src/app/components/field-unit/`.

`PowerCalculator` is the only client component. Its state lives in `SizingProvider`, so
every other section renders on the server and `/field-unit` is statically prerendered.

The power model — load catalog, watt/day math, verdict thresholds — lives in
`src/lib/site-power.ts`, ported from the design file's logic block. The monthly figure it
shows is simply units × the rental price from `src/lib/rental.ts`.

### Known gaps carried over from the design

- **"How long between site visits?"** and the **ZIP / site** field are captured but don't
  feed the result. They don't in the design prototype either; deciding what they should do
  is a product call.
- The design's priced add-ons table and the old $900/mo + $250 deposit reservation form
  were removed when the offer changed to the flat rental. Both are in git history.

## The rental offer and `/rent`

One offer, defined once in `src/lib/rental.ts` — change a number there and the copy, the
flow and the checkout all follow:

| | |
|---|---|
| Rental | **$299/mo**, Starlink service included, customer refuels |
| Delivery & setup | **$150** one-time |
| Due at checkout | **$449** (first month + delivery) |
| Promise | Online **48–72 hours** after payment |
| Service area | Idaho · Oregon · Washington · Montana |
| Fuel service | By arrangement, priced per gallon delivered — `/contact`, or the opt-in in the flow |

`/rent` (`RentFlow`) is three steps, then Stripe:

1. **Service location** — `SitePinMap`, a Leaflet map. Click to drop a pin, drag to adjust,
   search for a town, or use the device's location; map / satellite toggle. Plus access notes.
2. **Your details** — name, company, email, phone, what they're powering, and whether they
   want a fuel-service quote.
3. **Review + pay** — the order, the concrete online-by window, and the $449 total.

- `POST /api/rent` validates everything again server-side (including the service area),
  emails the team, and creates a Stripe Checkout session in **subscription** mode: $299/mo
  recurring plus the one-time $150, so month two onward bills itself. Stripe's hosted page
  takes the card, which keeps this app out of PCI scope.
- `/rent/confirmed` verifies `payment_status` server-side, then shows the order number,
  the delivery window counted from the moment of payment, and what happens next. The X
  purchase conversion fires from there.
- The Stripe webhook (`checkout.session.completed`) sends the team a second, **PAID** email
  with the pin, a map link and the delivery deadline. That email is the dispatch trigger —
  the "rental started" one only means someone reached checkout.
- The draft is kept in `sessionStorage`, so backing out of Stripe returns to step 3 with
  the pin and details intact.

Service-area check: `inServiceArea()` is a deliberately coarse offline test (the four
states' bounding box minus Wyoming's corner). The reverse geocoder can additionally reject a
pin whose state it names as something else, but it can never approve one. The team still
confirms every site.

Map services, all keyless and called from the visitor's browser: OpenStreetMap tiles, Esri
World Imagery for satellite, and OSM Nominatim for search / "near <town>". Fine at
prototype volume; if traffic grows, move to a keyed provider (Mapbox, MapTiler, Google)
— the URLs are in `SitePinMap.tsx` and `src/lib/geocode.ts`.

## Hero videos

`Hero` (`/`) and the `/dji-dock` hero both render through `AmbientVideo`, a small
client component that shows the poster immediately and attaches `src` only after
`window.load` fires *and* the element scrolls into view.

Don't put a plain `<video autoPlay preload="auto">` back. Chrome — desktop and
Android — fetches the whole file as part of the initial navigation, so the tab
spinner keeps turning until the last byte lands. Safari defers that fetch, so the
stall is invisible on Mac/iPhone and very visible everywhere else.

## Known TODOs

- **Rentals aren't persisted.** Payment goes through Stripe and the order is emailed, but
  there's no datastore — Stripe's dashboard and the notification emails are the only records.
- **The five-unit limit isn't enforced.** Nothing stops a sixth checkout. Until there's
  inventory tracking, pause sales by hand when the units are out.
- **No rental terms / cancellation page.** The flow says the card is charged $299 monthly
  "for as long as you keep the unit"; minimum term, returns, damage and refund terms need
  writing and linking from step 3.
- **Sales tax isn't collected.** Turn on Stripe Tax (`automatic_tax`) if it applies.
- **`/off-grid` still models buying units** (upfront and 10-year cost). Its CTAs now point
  at `/rent` and `/contact`, but the cost model itself is a purchase model.
- **EV Backup** — the EV-charger section and add-on were removed from the live site; the current unit (2,000 W / 4 kW peak) can't sustain Level 2 charging. Reintroduce when a higher-output unit ships. Prototype kept in `project/Sitepulse EV Backup.html` for reference.
- **"Read the field report"** CTA is a dead link.
- **Dealers / footer links** — all `href="#"` for now.
- **Hero videos are badly oversized.** `hero.mp4` is 5.98 MB for a 10 s 1264×720
  loop (≈4.8 Mbps — roughly 6× the bitrate this needs); `dock-hero.mp4` is
  1.84 MB. Re-encode both (H.264 ~800 kbps + a WebM/AV1 source) to get them under
  ~1 MB. `AmbientVideo` keeps them off the critical path, but on a job-site
  connection they're still a slow, expensive download.
- **`/assets/dock-lifestyle.png` doesn't exist.** The `/dji-dock` hero referenced
  it as a poster and got a 404, so that video now has no poster and shows a black
  box until it loads. Export a frame from `dock-hero.mp4` to that path.
