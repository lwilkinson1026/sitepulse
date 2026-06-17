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
│   │   └── components/        One file per section
│   └── public/assets/         Product images
├── project/                   Original Claude Design HTML/JSX prototype (reference)
├── DESIGN_HANDOFF.md          Claude Design's handoff notes
└── README.md
```

## Landing page sections

`Header`, `Hero`, `Marquee`, `Pillars`, `RunCycle`, `UseCases`, `Specs`, `FieldReports`, `Configurator`, `FinalCTA`, `Footer`.

The `Configurator` is a client component (tier + add-ons + mount → live total). Everything else renders on the server.

## Known TODOs

- **Reserve buttons** are placeholders — no payment flow wired up. Plan: Stripe Checkout for the $100 deposit, plus a small backend to persist reservations.
- **EV Backup** — the EV-charger section and add-on were removed from the live site; the current unit (2,000 W / 4 kW peak) can't sustain Level 2 charging. Reintroduce when a higher-output unit ships. Prototype kept in `project/Sitepulse EV Backup.html` for reference.
- **"Talk to an engineer" / "Download spec PDF" / "Read the field report"** CTAs are dead links.
- **Dealers / footer links** — all `href="#"` for now.
