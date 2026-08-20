import Link from "next/link";

const COLUMNS: ReadonlyArray<{
  title: string;
  links: ReadonlyArray<readonly [string, string]>;
}> = [
  {
    title: "PRODUCT",
    links: [
      ["#calc", "Calculator"],
      ["#addons", "Add-ons"],
      ["#coverage", "Coverage"],
    ],
  },
  {
    title: "RESOURCES",
    links: [
      ["/field-guide", "Field guide"],
      ["/off-grid", "Off-grid sizing tool"],
      ["#faq", "FAQ"],
    ],
  },
];

export function FieldUnitFooter() {
  return (
    <footer
      className="border-t pt-16 pb-10"
      style={{ borderColor: "var(--line-strong)" }}
    >
      <div className="wrap">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="mono text-[13px] tracking-[.14em] font-semibold">
                SITEPULSE
              </span>
            </div>
            <p className="text-[var(--mute)] text-[14px] leading-[1.55] m-0 max-w-[380px]">
              Off-grid site power and connectivity — delivered, monitored, and serviced.
              Idaho · Eastern Washington · Western Montana.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="eyebrow mb-3.5">{col.title}</div>
              <div className="flex flex-col gap-2.5">
                {col.links.map(([href, label]) =>
                  href.startsWith("#") ? (
                    <a key={href} href={href} className="ulink text-[13px] no-underline">
                      {label}
                    </a>
                  ) : (
                    <Link
                      key={href}
                      href={href}
                      className="ulink text-[13px] no-underline"
                    >
                      {label}
                    </Link>
                  ),
                )}
              </div>
            </div>
          ))}

          <div>
            <div className="eyebrow mb-3.5">CONTACT</div>
            <div className="flex flex-col gap-2.5">
              <Link href="/contact" className="ulink mono text-[12px] no-underline">
                TALK TO AN ENGINEER
              </Link>
              <span className="mono text-[12px] text-[var(--mute)]">
                COEUR D&apos;ALENE, ID
              </span>
            </div>
          </div>
        </div>

        <div className="rule" />

        <div className="flex flex-wrap gap-4 justify-between mt-6">
          <span className="mono text-[10.5px] tracking-[.16em] text-[var(--mute)]">
            © {new Date().getFullYear()} SITEPULSE FIELD SYSTEMS
          </span>
          <span className="mono text-[10.5px] tracking-[.16em] text-[var(--mute)]">
            NRTL FIELD EVAL · IN PROGRESS
          </span>
        </div>
      </div>
    </footer>
  );
}
