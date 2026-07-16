import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "../components/Eyebrow";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

export const metadata: Metadata = {
  title: "Sitepulse × UVT — Always-On Power for Always-On DFR",
  description:
    "An exploration of silent hybrid power for UVT's Drone-as-First-Responder docks — deployed where the grid can't reach, is permit-blocked, or would take months to trench in.",
  robots: { index: false, follow: false },
};

// Hero stats — power & deployment, the things Sitepulse actually changes.
const HERO_STATS: ReadonlyArray<readonly [string, string]> = [
  ["~140 W", "Avg dock load · 3 flights/day"],
  ["~95%", "Runs silent on battery"],
  ["Weeks", "Unattended between fuel"],
  ["1 afternoon", "Deploy · no trench, no permit"],
];

// The DFR power gap — why a dock's best location often has no power.
const GAP_POINTS: ReadonlyArray<{ title: string; body: string }> = [
  {
    title: "Coverage is placed by response time, not by outlets",
    body: "A DFR site earns its keep by shrinking the arrival window on a 911 call. The optimal dock location is a math problem of population, call density and flight radius — and the answer is often a rooftop, a pole, a tower site or a perimeter with no usable power drop nearby.",
  },
  {
    title: "The grid quote is measured in months",
    body: "A new metered service, a trench across a parking lot, or a utility easement turns a one-week install into a multi-month capital project. Every month a site waits is a month of coverage an agency doesn't have.",
  },
  {
    title: "Generators don't belong next to neighborhoods",
    body: "DFR docks sit close to where people live. A conventional generator running 24/7 is loud, smelly, and a community-relations problem. Public safety needs power that's invisible — and silent.",
  },
];

// Power profile of a DFR dock (DJI Dock 3 + Matrice 4D), by mode.
const DRAW_ROWS: ReadonlyArray<{ mode: string; draw: string; notes: string }> = [
  {
    mode: "Ready / on-call",
    draw: "100–150 W",
    notes:
      "Dock closed, aircraft charged, DAA + comms live, waiting for the dispatch trigger. This is ~90% of every day.",
  },
  {
    mode: "Launch + recharge",
    draw: "200–280 W avg",
    notes:
      "Post-mission, ~27–32 min. 240 W charging hub tops the Matrice while the dock resets for the next call.",
  },
  {
    mode: "Hot / cold extremes",
    draw: "300–500+ W",
    notes:
      "HVAC works hard at +45 °C or below freezing. Brief, weather-dependent — well within the 2 kW inverter's continuous rating.",
  },
  {
    mode: "Daily blended average",
    draw: "130–180 W",
    notes:
      "Even a busy DFR site spends most of the day on-call. Standby dominates; launches are short and infrequent by comparison.",
  },
];

// Why Sitepulse fits the DFR mission specifically.
const WHY_POINTS: ReadonlyArray<{ title: string; body: string }> = [
  {
    title: "Silent by default — engine sleeps 95% of the time",
    body: "The 1.54 kWh LFP pack carries the on-call load for 40+ hours on its own. The engine only wakes for short recharge windows, then shuts down. Neighbors hear nothing. A DFR dock on a residential rooftop stays a good neighbor.",
  },
  {
    title: "Stand up a DFR site in an afternoon",
    body: "No metered service, no trenching, no utility timeline. Set it down, connect the dock, and the site is live the same day. Add coverage where the response-time map says you need it — not where the nearest outlet happens to be.",
  },
  {
    title: "“Always On” power to match Always On drones",
    body: "Battery-first with an engine backstop and weeks of onboard fuel. If one source dips, the other carries the load. The dock stays ready for the call that hasn't come in yet — which is the whole point of DFR.",
  },
  {
    title: "Starlink uplink built in",
    body: "Integrated Starlink Mini plus cellular failover streams live video and telemetry to the command center from sites with no fiber and spotty LTE — exactly the coverage-gap areas where a new DFR dock does the most good.",
  },
  {
    title: "Relocatable as your coverage map evolves",
    body: "Pilot a corridor for a season, then move the whole power + dock kit to the next priority zone. No stranded electrical investment. The unit is ~90 lb, IP65, and built to be picked up and redeployed.",
  },
  {
    title: "American-built, field-serviceable",
    body: "Assembled in Yakima, Washington, with standard fuel and off-the-shelf serviceable parts. Made for agencies that care where their equipment comes from and need to keep it running without a specialist on site.",
  },
];

// Concrete DFR deployment scenarios.
const SCENARIOS: ReadonlyArray<{ tag: string; title: string; body: string }> = [
  {
    tag: "URBAN ROOFTOP",
    title: "Downtown DFR node, no roof power",
    body: "A high-call-density district needs a dock on a rooftop that was never wired for it. Sitepulse powers the site silently without a new service run or a landlord electrical project.",
  },
  {
    tag: "COVERAGE EDGE",
    title: "Filling the response-time gap",
    body: "The far edge of a jurisdiction sits minutes beyond the current dock's radius. Drop a relocatable Sitepulse + dock kit to extend coverage now, while the permanent site works through utility approvals.",
  },
  {
    tag: "CRITICAL INCIDENT",
    title: "Temporary site, days not months",
    body: "A wildfire perimeter, a major event, or a prolonged incident needs eyes overhead for a week. Stand up a docked drone on generator-grade power that no one has to babysit or refuel nightly.",
  },
  {
    tag: "RURAL AGENCY",
    title: "Wide area, thin infrastructure",
    body: "A county with long distances and little grid at the edges gets a fixed DFR presence where trenching power was never realistic — on Starlink, running for weeks between visits.",
  },
];

export default function UvtPage() {
  return (
    <>
      <Header />

      {/* HERO */}
      <section
        id="top"
        className="relative pt-[68px] overflow-hidden"
        style={{ minHeight: "100vh" }}
      >
        <div className="absolute inset-0 grid-bg" />
        <div className="stars" />
        <div
          className="nebula"
          style={{ width: 780, height: 780, left: "-200px", top: "20%" }}
        />
        <div
          className="nebula"
          style={{
            width: 520,
            height: 520,
            right: "-100px",
            top: "50%",
            opacity: 0.25,
          }}
        />

        <div className="relative max-w-[1440px] mx-auto px-8">
          <div className="mt-12 flex items-center gap-3 mono text-[11px] tracking-[.18em] text-zinc-500 uppercase">
            <span className="pulse-dot" />
            <span>SITEPULSE × UVT · DFR POWER EXPLORATION</span>
          </div>

          <div className="mt-10 mono text-[12px] tracking-[.22em] text-[var(--hi)] uppercase">
            DRONE AS FIRST RESPONDER · PUBLIC SAFETY · REMOTE OPS
          </div>

          <h1
            className="display-x mt-6 leading-[.92] max-w-[1100px]"
            style={{ fontSize: "clamp(52px, 8.5vw, 128px)" }}
          >
            Always-On power for
            <br />
            <span style={{ color: "var(--hi)" }} className="text-glow">
              Always-On drones.
            </span>
          </h1>

          <p className="mt-10 max-w-[700px] text-[17px] leading-[1.65] text-zinc-400">
            UVT places DFR docks where they cut the most seconds off a 911 call.
            Too often, that spot has no power. Sitepulse is a silent hybrid power
            station that runs a DJI Dock&nbsp;3 on battery{" "}
            <strong className="text-zinc-200">~95% of the day</strong> — the
            engine only wakes for short recharges. Set a dock on the rooftop, the
            pole, or the coverage edge, and keep it{" "}
            <strong className="text-zinc-200">always on</strong>.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/dji-dock" className="btn btn-cy">
              SEE THE DOCK POWER PROFILE <span>→</span>
            </Link>
            <Link href="/#config" className="btn btn-ghost">
              CONFIGURE A UNIT →
            </Link>
          </div>

          {/* HERO VIDEO */}
          <div className="mt-20 relative">
            <div
              className="aspect-[21/9] relative overflow-hidden border"
              style={{ borderColor: "var(--line-strong)", background: "#000" }}
            >
              {/* YouTube hero — sized to COVER the 21:9 frame (16:9 source, top/bottom cropped) */}
              <iframe
                src="https://www.youtube.com/embed/l-NsN711s6c?autoplay=1&mute=1&loop=1&playlist=l-NsN711s6c&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&disablekb=1"
                title="Sitepulse × UVT — DFR power concept"
                allow="autoplay; encrypted-media; picture-in-picture"
                className="absolute top-1/2 left-1/2 pointer-events-none"
                style={{
                  width: "100%",
                  height: "131.25%",
                  transform: "translate(-50%, -50%)",
                  border: 0,
                }}
              />
              {/* corner ticks */}
              <span
                className="absolute top-3 left-3 w-4 h-4 border-l border-t"
                style={{ borderColor: "var(--line-strong)" }}
              />
              <span
                className="absolute top-3 right-3 w-4 h-4 border-r border-t"
                style={{ borderColor: "var(--line-strong)" }}
              />
              <span
                className="absolute bottom-3 left-3 w-4 h-4 border-l border-b"
                style={{ borderColor: "var(--line-strong)" }}
              />
              <span
                className="absolute bottom-3 right-3 w-4 h-4 border-r border-b"
                style={{ borderColor: "var(--line-strong)" }}
              />
            </div>
            <div className="mt-3 mono text-[10px] tracking-[.22em] text-zinc-500 uppercase text-center">
              CONCEPT · SITEPULSE V1 POWERING A DFR DOCK · FOR DISCUSSION WITH UVT
            </div>
          </div>

          <div
            className="mt-12 mb-24 grid grid-cols-2 md:grid-cols-4 border-t border-b"
            style={{ borderColor: "var(--line-strong)" }}
          >
            {HERO_STATS.map(([n, l]) => (
              <div
                key={l}
                className="px-6 py-7 border-r last:border-r-0"
                style={{ borderColor: "var(--line-strong)" }}
              >
                <div className="display text-[34px] tracking-[-.04em] leading-none">
                  {n}
                </div>
                <div className="mt-2 mono text-[11px] uppercase tracking-[.16em] text-zinc-500">
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE DFR POWER GAP */}
      <section
        className="relative py-32 border-t border-b"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="max-w-[1440px] mx-auto px-8">
          <Eyebrow num="01" label="THE PROBLEM" />
          <h2
            className="display-x mt-6 leading-[.95] tracking-[-.045em] max-w-[1100px]"
            style={{ fontSize: "clamp(40px, 6vw, 88px)" }}
          >
            The best dock site
            <br />
            rarely has power.
          </h2>
          <p className="mt-8 max-w-[680px] text-[17px] leading-[1.65] text-zinc-400">
            A DFR program lives and dies on arrival time. But the location that
            minimizes response time is chosen by geography and call data — and
            that spot is usually a rooftop, a pole, a tower, or a perimeter with
            no practical way to plug in.
          </p>

          <div
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-px"
            style={{ background: "var(--line-strong)" }}
          >
            {GAP_POINTS.map((p, i) => (
              <div key={p.title} className="bg-black p-10 lift">
                <div className="mono text-[11px] tracking-[.2em] text-[var(--hi)]">
                  /0{i + 1}
                </div>
                <h3 className="display mt-10 text-[23px] tracking-[-.025em] leading-[1.15]">
                  {p.title}
                </h3>
                <p className="mt-4 text-[14px] leading-[1.6] text-zinc-400">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POWER PROFILE TABLE */}
      <section
        className="relative py-32 border-b"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative max-w-[1440px] mx-auto px-8">
          <Eyebrow num="02" label="POWER PROFILE" />
          <h2
            className="display-x mt-6 leading-[.95] tracking-[-.045em] max-w-[1100px]"
            style={{ fontSize: "clamp(40px, 6vw, 88px)" }}
          >
            What a DFR dock
            <br />
            actually draws.
          </h2>
          <p className="mt-8 max-w-[660px] text-[17px] leading-[1.65] text-zinc-400">
            A docked drone is a low-average, occasionally-peaky load. It sits
            on-call most of the day and only pulls real power during the short
            recharge after a launch. That profile is exactly what a battery-first
            hybrid is built for.
          </p>

          <div
            className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-px"
            style={{ background: "var(--line-strong)" }}
          >
            {DRAW_ROWS.map((r) => (
              <div key={r.mode} className="bg-black p-10 lift">
                <div className="flex items-baseline justify-between">
                  <div className="mono text-[11px] tracking-[.2em] uppercase text-[var(--hi)]">
                    {r.mode}
                  </div>
                  <div className="display-x text-[36px] tracking-[-.04em] leading-none">
                    {r.draw}
                  </div>
                </div>
                <p className="mt-6 text-[14px] leading-[1.6] text-zinc-400">
                  {r.notes}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-[14px] leading-[1.65] text-zinc-500 max-w-[680px]">
            Figures model a DJI Dock 3 + Matrice 4D. Published Dock 3 max input is
            ~800 W; sustained averages are far lower. The 2,000 W pure-sine
            inverter (4 kW peak) absorbs launch and HVAC peaks with headroom to
            spare. See the{" "}
            <Link href="/dji-dock" className="underline hover:text-[var(--hi)]">
              full dock power breakdown
            </Link>
            .
          </p>
        </div>
      </section>

      {/* WHY SITEPULSE FOR DFR */}
      <section
        className="relative py-32 border-b"
        style={{ borderColor: "var(--line)" }}
      >
        <div
          className="nebula"
          style={{
            width: 600,
            height: 600,
            right: "-180px",
            top: "10%",
            opacity: 0.25,
          }}
        />
        <div className="relative max-w-[1440px] mx-auto px-8">
          <Eyebrow num="03" label="WHY IT FITS DFR" />
          <h2
            className="display-x mt-6 leading-[.95] tracking-[-.045em] max-w-[1100px]"
            style={{ fontSize: "clamp(40px, 6vw, 88px)" }}
          >
            Power that behaves
            <br />
            like a first responder.
          </h2>

          <div
            className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px"
            style={{ background: "var(--line-strong)" }}
          >
            {WHY_POINTS.map((p, i) => (
              <div key={p.title} className="bg-black p-10 lift">
                <div className="mono text-[11px] tracking-[.2em] text-[var(--hi)]">
                  /0{i + 1}
                </div>
                <h3 className="display mt-10 text-[23px] tracking-[-.025em] leading-[1.15]">
                  {p.title}
                </h3>
                <p className="mt-4 text-[14px] leading-[1.6] text-zinc-400">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPLOYMENT SCENARIOS */}
      <section
        className="relative py-32 border-b"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="max-w-[1440px] mx-auto px-8">
          <Eyebrow num="04" label="WHERE IT DEPLOYS" />
          <h2
            className="display-x mt-6 leading-[.95] tracking-[-.045em] max-w-[1100px]"
            style={{ fontSize: "clamp(40px, 6vw, 88px)" }}
          >
            Four sites UVT
            <br />
            could power today.
          </h2>

          <div
            className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-px"
            style={{ background: "var(--line-strong)" }}
          >
            {SCENARIOS.map((s) => (
              <div key={s.title} className="bg-black p-10 lift">
                <div className="mono text-[10px] tracking-[.22em] uppercase text-zinc-500">
                  {s.tag}
                </div>
                <h3 className="display mt-6 text-[26px] tracking-[-.03em] leading-[1.1]">
                  {s.title}
                </h3>
                <p className="mt-5 text-[15px] leading-[1.6] text-zinc-400">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        className="relative py-32 border-b overflow-hidden"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="stars opacity-40" />
        <div
          className="nebula"
          style={{
            width: 800,
            height: 800,
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
            opacity: 0.3,
          }}
        />
        <div className="relative max-w-[1440px] mx-auto px-8 text-center">
          <div className="mono text-[12px] tracking-[.22em] uppercase text-[var(--hi)]">
            SITEPULSE × UVT · LET&rsquo;S SCOPE A PILOT
          </div>
          <h2
            className="display-x mt-8 leading-[.92] tracking-[-.05em]"
            style={{ fontSize: "clamp(40px, 7.5vw, 116px)" }}
          >
            Put a dock where
            <br />
            the grid can&rsquo;t.
          </h2>
          <p className="mt-8 max-w-[620px] mx-auto text-[16px] leading-[1.65] text-zinc-400">
            Pick one coverage-gap site. We&rsquo;ll model the exact energy budget
            for your dock and aircraft, and spec a unit to keep it always on.
          </p>
          <div className="mt-14 flex flex-wrap justify-center items-center gap-4">
            <Link href="/contact" className="btn btn-cy">
              START A PILOT CONVERSATION <span>→</span>
            </Link>
            <Link href="/dji-dock" className="btn btn-ghost">
              DOCK POWER DETAIL →
            </Link>
          </div>
          <p className="mt-12 mono text-[10px] tracking-[.2em] uppercase text-zinc-600">
            Exploratory concept prepared for UVT · not a public page
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
