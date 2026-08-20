import Image from "next/image";

const ENVELOPE: ReadonlyArray<readonly [string, string]> = [
  ["4 kW", "SURGE"],
  ["2 kW", "FOR ~42 MIN"],
  ["1.6 kW", "INDEFINITE"],
];

const TELEMETRY: ReadonlyArray<readonly [string, string]> = [
  ["SOC", "87%"],
  ["LOAD", "142 W"],
  ["FUEL", "11.2 gal"],
  ["UPTIME", "18 d"],
];

export function FieldUnitHero() {
  return (
    <section className="relative pt-[120px] pb-[100px] overflow-hidden">
      <div className="stars" style={{ opacity: 0.5 }} />
      <div className="grid-bg absolute inset-0" style={{ opacity: 0.25 }} />
      <div
        className="nebula"
        style={{
          top: -100,
          right: -100,
          width: 500,
          height: 500,
          opacity: 0.4,
        }}
      />

      <div className="wrap relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-20 items-center">
          <div>
            <div className="flex flex-wrap gap-2.5 mb-8">
              <span className="badge">
                <span className="dot" />2 UNITS IN THE FIELD · LIVE
              </span>
              <span className="badge" style={{ color: "var(--paper)" }}>
                INLAND NORTHWEST
              </span>
            </div>

            <h1
              className="display-x text-glow m-0 mb-7 leading-[.95] tracking-[-.035em]"
              style={{ fontSize: "clamp(48px, 8vw, 84px)" }}
            >
              Power where
              <br />
              there isn&apos;t any.
            </h1>

            <p className="text-[22px] leading-[1.35] font-medium tracking-[-.01em] m-0 mb-3">
              Weeks unattended. Wi-Fi included. One box, delivered.
            </p>
            <p className="mono text-[12px] tracking-[.16em] text-[var(--mute)] m-0 mb-10">
              IDAHO · EASTERN WASHINGTON · WESTERN MONTANA
            </p>

            <div className="flex flex-wrap gap-3.5 mb-12">
              <a href="#calc" className="btn btn-cy px-[22px] text-[14px]">
                Size my site →
              </a>
              <a href="#how" className="btn btn-ghost px-[22px] text-[14px]">
                How it works
              </a>
            </div>

            <div
              className="border p-5 px-6 max-w-[560px]"
              style={{ borderColor: "var(--line-strong)" }}
            >
              <div className="eyebrow mb-3.5">HONEST ENVELOPE</div>
              <div className="grid grid-cols-3 gap-3 sm:gap-5">
                {ENVELOPE.map(([value, label], i) => (
                  <div
                    key={label}
                    className={i > 0 ? "border-l pl-3 sm:pl-5" : undefined}
                    style={i > 0 ? { borderColor: "var(--line)" } : undefined}
                  >
                    <div className="num text-[18px] sm:text-[22px] font-semibold">
                      {value}
                    </div>
                    <div className="mono text-[9px] sm:text-[10.5px] text-[var(--mute)] tracking-[.1em] mt-1">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              className="relative aspect-[4/5] border overflow-hidden"
              style={{
                borderColor: "var(--line-strong)",
                background: "rgba(255,255,255,.02)",
              }}
            >
              <Image
                src="/assets/unit-hero.jpg"
                alt="Sitepulse field unit deployed on a remote site"
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover"
                priority
              />

              <div className="absolute top-4 left-4 right-4 flex justify-between gap-2 pointer-events-none">
                <span className="badge" style={{ background: "rgba(0,0,0,.6)" }}>
                  <span className="dot" />
                  UNIT · 002
                </span>
                <span
                  className="badge mono"
                  style={{ background: "rgba(0,0,0,.6)", color: "var(--paper)" }}
                >
                  47.6721° N · 116.7799° W
                </span>
              </div>

              <div
                className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-[60px] pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, transparent, rgba(0,0,0,.85) 60%)",
                }}
              >
                <div className="grid grid-cols-4 gap-3">
                  {TELEMETRY.map(([k, v]) => (
                    <div key={k}>
                      <div className="mono text-[9.5px] tracking-[.14em] text-[var(--mute)]">
                        {k}
                      </div>
                      <div className="num text-[18px] font-semibold mt-0.5">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
