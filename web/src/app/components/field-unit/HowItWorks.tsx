const STEPS = [
  {
    n: "01",
    eyebrow: "LOCATE",
    title: "Drop a pin.",
    desc: "Mark the exact spot on the map — satellite view helps — and add anything we should know about the road or the gate.",
  },
  {
    n: "02",
    eyebrow: "COMMIT",
    title: "$449 to start.",
    desc: "First month ($299) plus a one-time $150 delivery, paid online. That payment starts the clock.",
  },
  {
    n: "03",
    eyebrow: "48–72 HOURS",
    title: "We deliver and set up.",
    desc: "We confirm a drop-off time, set the unit down on your pin, commission your load and bring Starlink online.",
  },
  {
    n: "04",
    eyebrow: "RUN",
    title: "Keep it fuelled.",
    desc: "Top up the tank and it keeps running, billed monthly. Rather we did it? Fuel service is priced per gallon delivered.",
  },
] as const;

export function HowItWorks() {
  return (
    <section className="section" id="how">
      <div className="wrap">
        <div className="section-hd">
          <span className="idx">05 / HOW IT WORKS</span>
        </div>

        <h2 className="section-h2 mb-14" style={{ fontSize: "clamp(34px, 5vw, 56px)" }}>
          From a pin on a map <span style={{ color: "var(--mute)" }}>to online.</span>
        </h2>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t"
          style={{ borderColor: "var(--line-strong)" }}
        >
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="py-10 pr-8 relative border-r last:border-r-0"
              style={{ borderColor: "var(--line)" }}
            >
              <div className="num text-[64px] font-extralight text-[var(--mute)] leading-none mb-6 tracking-[-.03em]">
                {s.n}
              </div>
              <div className="mono text-[10.5px] tracking-[.18em] mb-2.5">{s.eyebrow}</div>
              <h3 className="text-[22px] m-0 mb-3 font-bold tracking-[-.01em]">
                {s.title}
              </h3>
              <p className="text-[var(--mute)] text-[14px] leading-[1.55] m-0">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
