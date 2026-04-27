import { Eyebrow } from "./Eyebrow";

const STATS: ReadonlyArray<{ n: string; l: string }> = [
  { n: "9 kW", l: "Net to vehicle" },
  { n: "30 mi/hr", l: "Range delivered" },
  { n: "~Level 2", l: "Equivalent class" },
];

export function EVTeaser() {
  return (
    <section
      className="relative py-32 border-b overflow-hidden"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div
        className="nebula"
        style={{
          width: 600,
          height: 600,
          left: "-120px",
          bottom: "-200px",
          opacity: 0.22,
        }}
      />
      <div className="relative max-w-[1440px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-end">
          <div className="lg:col-span-7">
            <Eyebrow num="06" label="BEYOND CONNECTIVITY · SECONDARY USE-CASE" />
            <h2
              className="display-x mt-6 leading-[.95] tracking-[-.045em]"
              style={{ fontSize: "clamp(40px, 6.5vw, 88px)" }}
            >
              Also: an
              <br />
              emergency EV charger.
            </h2>
            <p className="mt-8 max-w-[600px] text-[17px] leading-[1.65] text-zinc-400">
              The DLE 170 + high-output starter generator can deliver up to
              10–12 kW on demand — Level 2 charging speeds in a 90-lb box.
              Stranded twenty miles from town? Plug in. Be moving in under an
              hour.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#config" className="btn btn-cy">
                EXPLORE EV BACKUP <span>→</span>
              </a>
              <a href="#config" className="btn btn-ghost">
                ADD THE KIT TO YOUR BUILD
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="border" style={{ borderColor: "var(--line-strong)" }}>
              <div
                className="grid grid-cols-3 gap-px"
                style={{ background: "var(--line-strong)" }}
              >
                {STATS.map((s) => (
                  <div key={s.l} className="bg-black p-6">
                    <div className="display-x text-[36px] tracking-[-.04em] leading-none">
                      {s.n}
                    </div>
                    <div className="mt-3 mono text-[10px] uppercase tracking-[.16em] text-zinc-500">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="border-t p-6 flex items-center justify-between"
                style={{ borderColor: "var(--line-strong)" }}
              >
                <div className="mono text-[11px] uppercase tracking-[.18em] text-zinc-400">
                  EV-BACKUP KIT · ADD-ON
                </div>
                <div className="display text-[18px] tracking-[-.02em]">+$680</div>
              </div>
            </div>
            <div className="mt-4 mono text-[10px] uppercase tracking-[.18em] text-zinc-600">
              32 A PORTABLE EVSE · J1772 + NACS · GROUNDING ROD INCLUDED
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
