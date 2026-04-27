export function FinalCTA() {
  return (
    <section
      className="relative py-40 border-b overflow-hidden"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="stars opacity-50" />
      <div
        className="nebula"
        style={{
          width: 900,
          height: 900,
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          opacity: 0.35,
        }}
      />
      <div className="relative max-w-[1440px] mx-auto px-8 text-center">
        <div className="mono text-[12px] tracking-[.22em] uppercase text-[var(--hi)]">
          SHIPPING Q3 · V1 PROTOTYPE BUILDS
        </div>
        <h2
          className="display-x mt-8 leading-[.92] tracking-[-.05em]"
          style={{ fontSize: "clamp(56px, 11vw, 180px)" }}
        >
          Silent.
          <br />
          Online.
          <br />
          Unattended.
        </h2>
        <div className="mt-14 flex flex-wrap justify-center items-center gap-4">
          <a href="#config" className="btn btn-cy">
            RESERVE FROM $499 <span>→</span>
          </a>
          <a href="#" className="btn btn-ghost">
            TALK TO AN ENGINEER
          </a>
        </div>
      </div>
    </section>
  );
}
