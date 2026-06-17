import { Eyebrow } from "./Eyebrow";

type Case = { tag: string; title: string; body: string };

const CASES: ReadonlyArray<Case> = [
  {
    tag: "REMOTE MONITORING",
    title: "Pipeline sensor backhaul",
    body: "Weeks of unattended uptime on a single fuel fill. Engine runs ~1.5 hr/day. Every reading hits the cloud over Starlink, with cellular failover for telemetry.",
  },
  {
    tag: "BACKCOUNTRY RESEARCH",
    title: "Field station that stays online",
    body: "Powers Starlink Mini, a logger, and a couple of cameras 24/7. Silent enough to live next to a tent. Refuel cadence: weeks, not days.",
  },
  {
    tag: "WILDFIRE LOOKOUT",
    title: "Camera tower with live link",
    body: "PTZ camera + AI box + Starlink. Runs through a smoke event without intervention. Manual override available from the app if the duty cycle needs forcing.",
  },
  {
    tag: "DISASTER RESPONSE",
    title: "Comms node, deployed in minutes",
    body: "Lift it off the truck, plug in the external tank, raise the dish. Internet and a 120 V outlet within 90 seconds. A full 2,000 W (4 kW peak) available when crews arrive.",
  },
  {
    tag: "OIL & GAS PAD",
    title: "SCADA where the grid isn't",
    body: "Drives flow meters and a Starlink uplink for an entire well pad. Engine duty stays around 6%. Stabilizer auto-doses on shutdown for long sits between visits.",
  },
  {
    tag: "REMOTE OFFICE",
    title: "Cabin or jobsite trailer",
    body: "~40 W of Starlink and the controller lasts ~35 hours on battery alone. Plug in tools or a fridge and the engine joins in automatically. No switches to flip.",
  },
];

export function UseCases() {
  return (
    <section id="cases" className="py-32 border-b" style={{ borderColor: "var(--line)" }}>
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="flex items-end justify-between flex-wrap gap-8">
          <div>
            <Eyebrow num="03" label="WHO IT'S FOR" />
            <h2
              className="display-x mt-6 leading-[.95] tracking-[-.045em]"
              style={{ fontSize: "clamp(44px, 7vw, 96px)" }}
            >
              Built to stay,
              <br />
              not to babysit.
            </h2>
          </div>
          <div className="text-zinc-500 mono text-[11px] uppercase tracking-[.18em]">
            06 SCENARIOS
          </div>
        </div>

        <div
          className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{ background: "var(--line-strong)" }}
        >
          {CASES.map((c, i) => (
            <div key={c.tag} className="bg-black p-10 lift">
              <div className="flex items-center justify-between">
                <div className="mono text-[11px] tracking-[.18em] text-[var(--hi)]">
                  {c.tag}
                </div>
                <div className="mono text-[10px] tracking-[.16em] text-zinc-600">
                  /0{i + 1}
                </div>
              </div>
              <h3 className="display mt-10 text-[26px] tracking-[-.025em] leading-[1.15]">
                {c.title}
              </h3>
              <p className="mt-4 text-[14px] leading-[1.6] text-zinc-400">
                {c.body}
              </p>
              <div
                className="mt-10 pt-5 border-t flex items-center justify-between"
                style={{ borderColor: "var(--line)" }}
              >
                <span className="mono text-[10px] tracking-[.16em] uppercase text-zinc-500">
                  Read the field report
                </span>
                <span className="text-[var(--hi)]">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
