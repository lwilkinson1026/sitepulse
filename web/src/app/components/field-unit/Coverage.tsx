import Link from "next/link";
import {
  DELIVERY_FEE_USD,
  ONLINE_WINDOW_LABEL,
  SERVICE_STATES,
} from "@/lib/rental";

const FACTS: ReadonlyArray<readonly [string, string]> = [
  [`$${DELIVERY_FEE_USD}`, "ONE-TIME DELIVERY + SETUP"],
  [ONLINE_WINDOW_LABEL, "FROM PAYMENT TO ONLINE"],
  ["5", "V1 UNITS IN THIS FIRST RUN"],
];

export function Coverage() {
  return (
    <section className="section" id="coverage">
      <div className="wrap">
        <div className="section-hd">
          <span className="idx">04 / COVERAGE</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-start">
          <div>
            <h2
              className="section-h2 mb-6"
              style={{ fontSize: "clamp(34px, 5vw, 56px)" }}
            >
              Four states. <span style={{ color: "var(--mute)" }}>One pin.</span>
            </h2>
            <p className="text-[var(--mute)] text-[17px] leading-[1.55] m-0 mb-8">
              We deliver across the Pacific Northwest. Drop a pin on the exact spot — a
              pad, a gate, the back corner of a laydown yard — and that&apos;s where the
              unit gets set down, set up and brought online.
            </p>
            <Link href="/rent" className="btn btn-cy px-[22px] text-[14px]">
              Drop your pin →
            </Link>
          </div>

          <div>
            <div
              className="grid grid-cols-2 border-t border-l"
              style={{ borderColor: "var(--line-strong)" }}
            >
              {SERVICE_STATES.map((s) => (
                <div
                  key={s.code}
                  className="border-r border-b px-5 py-7 sm:px-7 sm:py-9"
                  style={{ borderColor: "var(--line-strong)" }}
                >
                  <div className="num text-[40px] sm:text-[56px] font-extralight leading-none tracking-[-.03em]">
                    {s.code}
                  </div>
                  <div className="mono text-[10.5px] tracking-[.18em] text-[var(--mute)] uppercase mt-3">
                    {s.name}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-5 mt-6">
              {FACTS.map(([value, label]) => (
                <div key={label}>
                  <div className="num text-[18px] sm:text-[22px] font-semibold">{value}</div>
                  <div className="mono text-[9px] sm:text-[10.5px] text-[var(--mute)] tracking-[.1em] mt-1">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="mt-10 px-6 py-5 border-l-2"
          style={{
            borderColor: "var(--paper)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <p className="m-0 text-[14px] text-[var(--mute)] leading-[1.55] max-w-[900px]">
            <span className="text-[var(--paper)] font-semibold">
              Somewhere else?
            </span>{" "}
            We&apos;re keeping this first run close to home so we can stand behind the
            delivery window. If your site is outside these four states,{" "}
            <Link href="/contact" className="text-[var(--paper)] underline">
              tell us where
            </Link>{" "}
            — it helps us decide where to go next.
          </p>
        </div>
      </div>
    </section>
  );
}
