const STEPS = [
  {
    n: "01",
    eyebrow: "CONFIGURE",
    title: "Size your site.",
    desc: "Use the calculator, get a verdict, save the config. Or just call — you tell me watts and days.",
  },
  {
    n: "02",
    eyebrow: "RESERVE",
    title: "$250 holds a unit.",
    desc: "Deposit is fully credited to month one. Refundable if we can’t make the site work.",
  },
  {
    n: "03",
    eyebrow: "SITE CALL",
    title: "We walk the site.",
    desc: "Access, siting, refuel plan, safety briefing. If you’re on a GC site, NRTL package lands before the call.",
  },
  {
    n: "04",
    eyebrow: "DEPLOY + WATCH",
    title: "Delivery, then telemetry.",
    desc: "I drop the box, commission the load, hand you a dashboard login. Service is scheduled off telemetry, not a calendar.",
  },
] as const;

export function HowItWorks() {
  return (
    <section className="section" id="how">
      <div className="wrap">
        <div className="section-hd">
          <span className="idx">06 / HOW IT WORKS</span>
        </div>

        <h2 className="section-h2 mb-14" style={{ fontSize: "clamp(34px, 5vw, 56px)" }}>
          From your inquiry <span style={{ color: "var(--mute)" }}>to retrieval.</span>
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
