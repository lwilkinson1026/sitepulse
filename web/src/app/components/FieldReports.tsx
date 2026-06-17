import { Eyebrow } from "./Eyebrow";

type Quote = { q: string; a: string; t: string };

const QUOTES: ReadonlyArray<Quote> = [
  {
    q: "It just sits there and stays online. We checked the dashboard, not the unit, for a full month.",
    a: "Wes Halverson",
    t: "Field ops, remote pipeline — Big Sky, MT",
  },
  {
    q: "~10 gallons a month for a Starlink uplink and a logger. The math finally works for our pads.",
    a: "Mira Okafor",
    t: "SCADA lead, basin operator — Williston, ND",
  },
  {
    q: "Engine started when it said it would, ran for about 90 minutes, and went quiet again. Boring. Good.",
    a: "David Cho",
    t: "Research engineer, hydrology station — Big Bend, TX",
  },
];

export function FieldReports() {
  return (
    <section className="py-32 border-b" style={{ borderColor: "var(--line)" }}>
      <div className="max-w-[1440px] mx-auto px-8">
        <Eyebrow num="05" label="FIELD REPORTS" />
        <h2
          className="display-x mt-6 leading-[.95] tracking-[-.045em]"
          style={{ fontSize: "clamp(44px, 7vw, 96px)" }}
        >
          From the people
          <br />
          actually using it.
        </h2>

        <div
          className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-px"
          style={{ background: "var(--line-strong)" }}
        >
          {QUOTES.map((Q, i) => (
            <div key={i} className="bg-black p-10 lift">
              <div className="text-[var(--hi)] text-[80px] leading-none display-x">
                &ldquo;
              </div>
              <p className="-mt-6 text-[20px] leading-[1.4] tracking-[-.01em] text-zinc-100">
                {Q.q}
              </p>
              <div
                className="mt-12 pt-5 border-t"
                style={{ borderColor: "var(--line)" }}
              >
                <div className="text-[15px] font-semibold">{Q.a}</div>
                <div className="mt-1 mono text-[11px] tracking-[.16em] uppercase text-zinc-500">
                  {Q.t}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
