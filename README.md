# Sitepulse

Marketing site for Sitepulse — a 90-lb hybrid power system (LFP battery + Starlink Mini + DLE 170 cc engine) built for unattended remote operation.

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

`Header`, `Hero`, `Marquee`, `Pillars`, `RunCycle`, `UseCases`, `Specs`, `FieldReports`, `EVTeaser`, `Configurator`, `FinalCTA`, `Footer`.

The `Configurator` is a client component (tier + add-ons + mount → live total). Everything else renders on the server.

## Known TODOs

- **Reserve buttons** are placeholders — no payment flow wired up. Plan: Stripe Checkout for the $499 deposit, plus a small backend to persist reservations.
- **EV Backup page** — the prototype includes a separate `Sitepulse EV Backup.html`. Nav link currently points to `#config`. Port this as `/ev-backup` when needed.
- **"Talk to an engineer" / "Download spec PDF" / "Read the field report"** CTAs are dead links.
- **Dealers / footer links** — all `href="#"` for now.
