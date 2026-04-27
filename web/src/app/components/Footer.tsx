type Column = readonly [string, ReadonlyArray<string>];

const COLUMNS: ReadonlyArray<Column> = [
  ["Product", ["The Unit", "Specs", "Configure", "Compare", "Reviews"]],
  [
    "Use Cases",
    [
      "Remote Monitoring",
      "Backcountry Research",
      "Disaster Response",
      "Oil & Gas",
      "Off-Grid Sites",
    ],
  ],
  [
    "Support",
    ["Owner's Manual", "Field Service", "Firmware", "Warranty", "Contact"],
  ],
  ["Company", ["Bozeman Plant", "Careers", "Press", "Investors", "Privacy"]],
];

export function Footer() {
  return (
    <footer id="support" className="py-24">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="flex flex-wrap items-end justify-between gap-12">
          <div className="max-w-[400px]">
            <div className="flex items-center">
              <span className="display text-[22px] tracking-[.04em] font-bold">
                SITEPULSE
              </span>
            </div>
            <p className="mt-6 text-[14px] leading-[1.6] text-zinc-400">
              Designed and assembled in Bozeman, Montana. A 90-lb true hybrid
              built for months of unattended remote operation — silent on
              battery, engine only when it has to.
            </p>
            <div className="mt-8 mono text-[10px] tracking-[.18em] uppercase text-zinc-500">
              <span className="pulse-dot mr-2" /> V1 prototype · reservations
              open
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 flex-1 max-w-[800px]">
            {COLUMNS.map(([t, l]) => (
              <div key={t}>
                <div className="mono text-[10px] tracking-[.18em] text-zinc-500 uppercase">
                  {t}
                </div>
                <ul className="mt-5 space-y-3">
                  {l.map((x) => (
                    <li key={x}>
                      <a
                        href="#"
                        className="text-[13px] text-zinc-300 hover:text-[var(--hi)] transition-colors"
                      >
                        {x}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div
          className="mt-20 pt-8 border-t flex flex-wrap items-center justify-between gap-4 mono text-[10px] tracking-[.18em] uppercase text-zinc-500"
          style={{ borderColor: "var(--line)" }}
        >
          <div>© 2026 Sitepulse Power, Inc. · Bozeman, Montana</div>
          <div>External fuel · Cellular failover · OTA · IP65</div>
          <div>Made in USA · Patents pending</div>
        </div>
      </div>
    </footer>
  );
}
