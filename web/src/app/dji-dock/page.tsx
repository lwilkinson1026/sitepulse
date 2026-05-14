import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "../components/Eyebrow";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

export const metadata: Metadata = {
  title: "Sitepulse — DJI Dock Power · Drone-in-a-Box",
  description:
    "Pair Sitepulse with the DJI Dock 3 / Dock 2 for silent, unattended drone-in-a-box deployments. Battery-first power for the standby load, engine assist only for charging peaks.",
};

const DRAW_ROWS: ReadonlyArray<{
  mode: string;
  draw: string;
  notes: string;
}> = [
  {
    mode: "Standby / Ready",
    draw: "100–150 W",
    notes:
      "Dock closed, monitoring, moderate temperature. Electronics + minimal climate control. ~90% of the day.",
  },
  {
    mode: "Charging cycle",
    draw: "200–280 W avg",
    notes:
      "Post-flight, 27–32 min. 240 W charging hub + dock overhead. Short duration.",
  },
  {
    mode: "Hot / cold extremes",
    draw: "300–500+ W",
    notes:
      "At +45 °C or below freezing the AC compressor or heaters run hard. Brief, weather-dependent.",
  },
  {
    mode: "Daily blended average",
    draw: "130–180 W",
    notes:
      "2–4 flights/day. Standby dominates; charging is infrequent.",
  },
];

const DOCK_MAX: ReadonlyArray<readonly [string, string, string]> = [
  ["DJI Dock 3", "800 W", "Latest · vehicle-mountable"],
  ["DJI Dock 2", "1,000 W", "Matrice 3D / 3TD"],
  ["DJI Dock", "1,500 W", "Original · stationary"],
];

const BUDGET_STATS: ReadonlyArray<readonly [string, string]> = [
  ["~140 W", "Avg load · 3 flights/day"],
  ["~3.2 kWh", "Energy per day"],
  ["15–20 hr", "Engine runtime / month"],
  ["48+ hr", "Battery autonomy at 100 W standby"],
];

const WHY_POINTS: ReadonlyArray<{ title: string; body: string }> = [
  {
    title: "Battery carries the standby load",
    body: "Dock spends 90–95% of the day at 100–150 W. The 1.54 kWh LFP pack carries that on its own for 40+ hours — far more than the gap between charge cycles.",
  },
  {
    title: "Engine only wakes for charge peaks",
    body: "Post-flight charging draws 200–280 W for ~30 minutes. The DLE 170 starts, tops the pack while the dock charges the aircraft, and shuts back down. Expect 15–20 hours of engine runtime a month at typical mission cadence.",
  },
  {
    title: "Headroom for the worst day",
    body: "The 4,000 W pure-sine inverter (8 kW surge) absorbs the Dock's 800–1,000 W peaks without breaking a sweat. Add an AC compressor spike in 110°F heat and you're still under half rated continuous.",
  },
  {
    title: "Starlink Mini, integrated",
    body: "Plan missions, stream live video, push OTA updates to the aircraft and the dock from anywhere there's sky. Cellular failover keeps telemetry alive even if Starlink drops.",
  },
  {
    title: "External fuel, unattended for weeks",
    body: "Quick-disconnect fuel tank sized for months between visits. Stabilizer auto-doses on every shutdown — show up next quarter and it still starts.",
  },
];

export default function DjiDockPage() {
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
            <span>SITEPULSE × DJI DOCK · DRONE-IN-A-BOX READY</span>
          </div>

          <div className="mt-10 mono text-[12px] tracking-[.22em] text-[var(--hi)] uppercase">
            REMOTE INSPECTION · MAPPING · SECURITY
          </div>

          <h1
            className="display-x mt-6 leading-[.92] max-w-[1100px]"
            style={{ fontSize: "clamp(56px, 9vw, 132px)" }}
          >
            Your drone dock.
            <br />
            <span style={{ color: "var(--hi)" }} className="text-glow">
              Powered anywhere.
            </span>
          </h1>

          <p className="mt-10 max-w-[680px] text-[17px] leading-[1.65] text-zinc-400">
            DJI Dock 3 + Matrice 4D draws roughly <strong className="text-zinc-200">140&nbsp;W on average</strong> across a typical
            inspection day. Sitepulse runs it silently on battery the vast majority of
            the time — the DLE 170 only spins up for short, efficient recharges. Set
            it on the canyon rim, log in over Starlink, fly missions for months.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/#config" className="btn btn-cy">
              CONFIGURE FOR DOCK <span>→</span>
            </Link>
            <Link href="/" className="btn btn-ghost">
              ← BACK TO SITEPULSE
            </Link>
          </div>

          {/* HERO VIDEO */}
          <div className="mt-20 relative">
            <div
              className="aspect-[21/9] relative overflow-hidden border"
              style={{ borderColor: "var(--line-strong)", background: "#000" }}
            >
              <video
                src="/assets/dock-hero.mp4"
                poster="/assets/dock-lifestyle.png"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-label="Sitepulse paired with a DJI Dock on a desert canyon rim"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 70%, rgba(0,0,0,.65) 100%)",
                }}
              />

              <div className="absolute top-6 left-6 mono text-[10px] tracking-[.22em] text-zinc-300 uppercase">
                <div>SITE-DOCK-07 · CANYONLANDS RIM</div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="pulse-dot" />
                  <span className="text-[var(--hi)]">MISSION READY</span>
                </div>
              </div>

              <div className="absolute top-6 right-6 w-[220px]">
                <div className="mono text-[10px] tracking-[.18em] text-zinc-200 uppercase flex justify-between">
                  <span>Dock load</span>
                  <span className="text-[var(--hi)]">142 W</span>
                </div>
                <div className="mt-1.5 h-[3px] bg-white/15">
                  <div
                    className="h-full bg-[var(--hi)] meter-fill"
                    style={{ width: "12%" }}
                  />
                </div>
                <div className="mt-3 mono text-[10px] tracking-[.18em] text-zinc-200 uppercase flex justify-between">
                  <span>Aircraft</span>
                  <span className="text-[var(--run)]">100%</span>
                </div>
                <div className="mt-1.5 h-[3px] bg-white/15">
                  <div
                    className="h-full meter-fill"
                    style={{ width: "100%", background: "var(--run)" }}
                  />
                </div>
              </div>

              <div className="absolute bottom-6 left-6 mono text-[10px] tracking-[.22em] text-zinc-300 uppercase">
                <div>3 FLIGHTS / DAY · 32 MIN AVG</div>
                <div className="mt-1">SINCE LAST FUEL: 41 DAYS</div>
              </div>

              <div className="absolute bottom-6 right-6 mono text-[10px] tracking-[.22em] text-zinc-300 uppercase text-right">
                <div className="text-zinc-100">UPLINK · STARLINK</div>
                <div className="mt-1">FAILOVER · LTE READY</div>
              </div>

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
              FIG. 02 · SITEPULSE V1 + DJI DOCK 3 · CANYONLANDS, UT
            </div>
          </div>

          <div
            className="mt-12 mb-24 grid grid-cols-2 md:grid-cols-4 border-t border-b"
            style={{ borderColor: "var(--line-strong)" }}
          >
            {BUDGET_STATS.map(([n, l]) => (
              <div
                key={l}
                className="px-6 py-7 border-r last:border-r-0"
                style={{ borderColor: "var(--line-strong)" }}
              >
                <div className="display text-[36px] tracking-[-.04em] leading-none">
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

      {/* DOCK COMPATIBILITY */}
      <section
        className="relative py-32 border-t border-b"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="max-w-[1440px] mx-auto px-8">
          <Eyebrow num="01" label="WHAT IT POWERS" />
          <h2
            className="display-x mt-6 leading-[.95] tracking-[-.045em] max-w-[1100px]"
            style={{ fontSize: "clamp(40px, 6vw, 88px)" }}
          >
            Every dock in the
            <br />
            Matrice lineup.
          </h2>
          <p className="mt-8 max-w-[640px] text-[17px] leading-[1.65] text-zinc-400">
            Sitepulse is rated for the full DJI Dock series. Below are the
            published maximum input figures from DJI — the peak you'd see
            during charging plus AC plus cover actuation in extreme weather.
            Sustained averages are dramatically lower.
          </p>

          <div className="mt-16">
            <div
              className="grid grid-cols-12 mono text-[10px] tracking-[.18em] text-zinc-500 uppercase pb-4 border-b"
              style={{ borderColor: "var(--line)" }}
            >
              <div className="col-span-5">Model</div>
              <div className="col-span-3">Max input</div>
              <div className="col-span-4">Notes</div>
            </div>
            {DOCK_MAX.map(([model, max, notes]) => (
              <div
                key={model}
                className="grid grid-cols-12 py-5 border-b items-baseline"
                style={{ borderColor: "var(--line)" }}
              >
                <div className="col-span-5 display text-[22px] tracking-[-.02em]">
                  {model}
                </div>
                <div className="col-span-3 display text-[22px] tracking-[-.02em] text-[var(--hi)]">
                  {max}
                </div>
                <div className="col-span-4 text-[14px] text-zinc-400 mono uppercase tracking-[.08em]">
                  {notes}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-[14px] leading-[1.65] text-zinc-500 max-w-[680px]">
            The Dock 3 charging hub is rated 240 W and takes a ~150 Wh Matrice
            4D battery from 15% to 95% in roughly 27 minutes. Peak draws above
            300 W only occur in extreme ambient temperatures when HVAC is
            working hard.
          </p>
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
            What it actually
            <br />
            draws, by mode.
          </h2>
          <p className="mt-8 max-w-[640px] text-[17px] leading-[1.65] text-zinc-400">
            DJI doesn't publish a single &ldquo;average&rdquo; figure because the
            load is mode-dependent. Here's the breakdown we model against, based
            on published specs plus contractor mission logs.
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
        </div>
      </section>

      {/* DAILY ENERGY BUDGET */}
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-6">
              <Eyebrow num="03" label="DAILY ENERGY BUDGET" />
              <h2
                className="display-x mt-6 leading-[.95] tracking-[-.045em]"
                style={{ fontSize: "clamp(36px, 5.5vw, 80px)" }}
              >
                A contractor day,
                <br />
                in kilowatt-hours.
              </h2>
              <p className="mt-8 text-[17px] leading-[1.65] text-zinc-400">
                Three flights per day on a Matrice 4D — typical inspection or
                mapping cadence. Pack carries standby. Engine starts twice
                during the charging windows. Everything else is silent.
              </p>
              <ul className="mt-10 space-y-4 text-[15px] leading-[1.6] text-zinc-300">
                <li className="flex gap-4">
                  <span className="mono text-[var(--hi)] flex-none">→</span>
                  <span>
                    <strong>22 hr standby</strong> @ 120 W avg ≈{" "}
                    <span className="text-zinc-100">2.6 kWh</span>
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="mono text-[var(--hi)] flex-none">→</span>
                  <span>
                    <strong>3 charge cycles</strong> × ~32 min @ 240 W ≈{" "}
                    <span className="text-zinc-100">0.4 kWh</span>
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="mono text-[var(--hi)] flex-none">→</span>
                  <span>
                    <strong>HVAC overhead</strong> (moderate climate) ≈{" "}
                    <span className="text-zinc-100">0.2 kWh</span>
                  </span>
                </li>
                <li className="flex gap-4 pt-2 border-t" style={{ borderColor: "var(--line)" }}>
                  <span className="mono text-[var(--hi)] flex-none">Σ</span>
                  <span>
                    <strong>Total</strong> ≈{" "}
                    <span className="display text-[22px] tracking-[-.02em] text-[var(--hi)]">
                      3.2 kWh / day
                    </span>
                  </span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-6">
              <div
                className="border p-8"
                style={{ borderColor: "var(--line-strong)" }}
              >
                <div className="mono text-[10px] tracking-[.22em] uppercase text-zinc-500">
                  HYBRID SPLIT — TYPICAL DAY
                </div>
                <div className="mt-8 space-y-6">
                  <div>
                    <div className="flex justify-between items-baseline mono text-[11px] tracking-[.18em] uppercase">
                      <span className="text-zinc-300">Battery only</span>
                      <span className="text-[var(--hi)]">~22 hr</span>
                    </div>
                    <div className="mt-2 h-[6px] bg-white/10">
                      <div
                        className="h-full bg-[var(--hi)]"
                        style={{ width: "92%" }}
                      />
                    </div>
                    <div className="mt-2 mono text-[10px] tracking-[.16em] uppercase text-zinc-500">
                      Silent · zero fuel · standby + telemetry
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-baseline mono text-[11px] tracking-[.18em] uppercase">
                      <span className="text-zinc-300">Engine assist</span>
                      <span className="text-zinc-200">~2 hr</span>
                    </div>
                    <div className="mt-2 h-[6px] bg-white/10">
                      <div
                        className="h-full"
                        style={{ width: "8%", background: "rgba(255,255,255,.55)" }}
                      />
                    </div>
                    <div className="mt-2 mono text-[10px] tracking-[.16em] uppercase text-zinc-500">
                      Short charge windows · tops the pack · auto-shutdown
                    </div>
                  </div>
                </div>

                <div
                  className="mt-10 pt-8 border-t grid grid-cols-3 gap-px"
                  style={{ borderColor: "var(--line-strong)", background: "var(--line-strong)" }}
                >
                  {[
                    ["~13 gal", "Fuel / month"],
                    ["~5%", "Engine duty cycle"],
                    ["~95%", "Silent operation"],
                  ].map(([n, l]) => (
                    <div key={l} className="bg-black p-5">
                      <div className="display text-[24px] tracking-[-.03em] leading-none">
                        {n}
                      </div>
                      <div className="mt-2 mono text-[10px] tracking-[.16em] uppercase text-zinc-500">
                        {l}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-5 mono text-[10px] tracking-[.18em] uppercase text-zinc-500 text-center">
                Scaled estimate · 3 flights/day · moderate climate · DOCK 3 + M4D
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY SITEPULSE */}
      <section
        className="relative py-32 border-b"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="max-w-[1440px] mx-auto px-8">
          <Eyebrow num="04" label="WHY THE PAIRING WORKS" />
          <h2
            className="display-x mt-6 leading-[.95] tracking-[-.045em] max-w-[1100px]"
            style={{ fontSize: "clamp(40px, 6vw, 88px)" }}
          >
            Built for the load
            <br />
            profile of a dock.
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
                <h3 className="display mt-10 text-[24px] tracking-[-.025em] leading-[1.15]">
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
            DOCK-READY · SHIPPING Q3
          </div>
          <h2
            className="display-x mt-8 leading-[.92] tracking-[-.05em]"
            style={{ fontSize: "clamp(44px, 8vw, 128px)" }}
          >
            Set down a dock.
            <br />
            Walk away for weeks.
          </h2>
          <div className="mt-14 flex flex-wrap justify-center items-center gap-4">
            <Link href="/#config" className="btn btn-cy">
              CONFIGURE FOR DOCK <span>→</span>
            </Link>
            <Link href="/" className="btn btn-ghost">
              ← BACK TO SITEPULSE
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
