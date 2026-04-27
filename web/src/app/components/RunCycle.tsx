import { Eyebrow } from "./Eyebrow";

type Phase = {
  h: string;
  title: string;
  body: string;
  source: "BATTERY" | "ENGINE";
  ring?: boolean;
};

const PHASES: ReadonlyArray<Phase> = [
  {
    h: "00:00 — IDLE",
    title: "Battery carries the radio",
    body: "Starlink Mini pulls ~25 W. Engine off. Pack drains roughly 1% per hour. Site at zero decibels.",
    source: "BATTERY",
  },
  {
    h: "+24 HOURS",
    title: "Still silent",
    body: "Day-one finishes at ~60% SOC. The control board is happy. Telemetry beats home every minute.",
    source: "BATTERY",
  },
  {
    h: "+48 HOURS",
    title: "Threshold reached",
    body: "Pack hits ~25%. Engine warm-start, idles up, generator picks up the load while the pack tops off.",
    source: "ENGINE",
    ring: true,
  },
  {
    h: "+48:23",
    title: "Engine shuts down",
    body: "Pack back to ~90% in 23 minutes. Cooldown sequence runs. Stabilizer doses on shutdown. System silent again.",
    source: "BATTERY",
  },
  {
    h: "REPEAT",
    title: "~2.4 days per cycle",
    body: "~13 gallons consumed per month. ~12 hours of total engine runtime. The other 97% of the time: silence.",
    source: "BATTERY",
  },
];

const TOTALS: ReadonlyArray<readonly [string, string]> = [
  ["12 hr", "Engine runtime / mo"],
  ["13 gal", "Fuel / mo @ 25 W avg"],
  ["1.6%", "Engine duty cycle"],
  ["~12", "Battery cycles / mo"],
];

export function RunCycle() {
  return (
    <section
      id="runs"
      className="py-32 border-b"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="max-w-[1440px] mx-auto px-8">
        <Eyebrow num="02" label="HOW IT RUNS" />
        <h2
          className="display-x mt-6 leading-[.95] tracking-[-.045em]"
          style={{ fontSize: "clamp(44px, 7vw, 96px)" }}
        >
          Silent for days.
          <br />
          23 minutes to recharge.
        </h2>
        <p className="mt-8 max-w-[640px] text-[17px] leading-[1.65] text-zinc-400">
          Connectivity-only mode: a Starlink Mini at ~25 W average. The control
          board tracks load, state-of-charge, and fuel — and starts the engine
          only when it has to.
        </p>

        <div className="mt-24 relative">
          <div
            className="absolute left-0 right-0 top-[calc(50%-1px)] h-px"
            style={{ background: "var(--line-strong)" }}
          />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-px relative">
            {PHASES.map((p, i) => (
              <div key={i} className="relative pt-12 pb-12 px-6">
                <div
                  className="absolute left-1/2 top-[calc(50%-6px)] -translate-x-1/2 w-3 h-3 rounded-full"
                  style={
                    p.ring
                      ? { border: "1.5px solid #fff", background: "#000" }
                      : {
                          background: "#fff",
                          boxShadow: "0 0 16px rgba(255,255,255,.4)",
                        }
                  }
                />
                <div className="text-center">
                  <div className="mono text-[11px] tracking-[.18em] text-zinc-500">
                    {p.h}
                  </div>
                </div>
                <div style={{ minHeight: "120px" }} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 -mt-4">
            {PHASES.map((p, i) => (
              <div
                key={i}
                className={`p-5 border lift bg-black ${i % 2 === 0 ? "mt-0" : "mt-24"}`}
                style={{ borderColor: "var(--line-strong)" }}
              >
                <div
                  className="mono text-[10px] tracking-[.16em] uppercase"
                  style={{ color: p.ring ? "rgba(255,255,255,.55)" : "#fff" }}
                >
                  {p.source}
                </div>
                <div className="display text-[20px] tracking-[-.02em] leading-tight mt-3">
                  {p.title}
                </div>
                <p className="mt-3 text-[13px] leading-[1.55] text-zinc-400">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="mt-32 grid grid-cols-2 md:grid-cols-4 border-t border-b"
          style={{ borderColor: "var(--line-strong)" }}
        >
          {TOTALS.map(([n, l]) => (
            <div
              key={l}
              className="px-6 py-8 border-r last:border-r-0"
              style={{ borderColor: "var(--line-strong)" }}
            >
              <div className="display text-[44px] tracking-[-.04em] leading-none">
                {n}
              </div>
              <div className="mt-2 mono text-[11px] tracking-[.16em] uppercase text-zinc-500">
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
