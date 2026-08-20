const QUESTIONS: ReadonlyArray<{ q: string; a: string }> = [
  {
    q: "Isn't that just a generator?",
    a: "A generator runs constantly and is sized for your peak. This is a battery that carries the load silently, with a small engine that runs only to refill it. At 100 W the engine runs about two hours a day — the other twenty-two are silent. A Honda at that load is below quarter throttle: two or three refuels a day, forever, and it's slowly destroying itself. Caterpillar's own guidance says never run a genset under 30 % of nameplate.",
  },
  {
    q: "Why not just add solar?",
    a: "Because you size solar for December, not July. The industry standard for one 50 W instrument is 290 W of panel at good sun and 1,010 W at two peak-sun-hours — which is North Idaho in winter — plus seven 110 Ah batteries. That's a fixed installation with a footprint, and it still browns out in a smoke event or a snow week.",
  },
  {
    q: "Is it UL listed?",
    a: "Not yet. It's in NRTL field evaluation — quote and timeline are attached to every proposal. In the meantime here's the test-data package: insulation resistance, GFCI, overcurrent, thermal at sustained load, ingress rating, fuel containment, BMS fault behavior. Ask, and it lands in your inbox before your safety manager does.",
  },
  {
    q: "What happens when it runs out of fuel?",
    a: "It tells me before it does. Fuel level, engine hours, state of charge, and load are all on a dashboard — you get a login too. Service visits are scheduled off the telemetry, not off a calendar. That's the actual product: not the box, the fact that you don't have to think about the box.",
  },
  {
    q: "Can you run my trailer's heat, a welder, or a saw all day?",
    a: "No. Anything over about 2 kW sustained is outside what this does. Use the calculator above — it'll tell you straight. If part of your load is small and continuous (cameras, sensors, comms), we can cover that piece and leave the heavy stuff on a towable.",
  },
];

export function Faq() {
  return (
    <section className="section" id="faq">
      <div className="wrap">
        <div className="section-hd">
          <span className="idx">07 / FAQ</span>
        </div>

        <h2 className="section-h2 mb-10" style={{ fontSize: "clamp(34px, 5vw, 56px)" }}>
          The five questions{" "}
          <span style={{ color: "var(--mute)" }}>you&apos;re about to ask.</span>
        </h2>

        <div className="max-w-[900px]">
          {QUESTIONS.map(({ q, a }) => (
            <details key={q} className="qa">
              <summary>
                <span>{q}</span>
                <span className="plus" aria-hidden>
                  +
                </span>
              </summary>
              <div className="ans">{a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
