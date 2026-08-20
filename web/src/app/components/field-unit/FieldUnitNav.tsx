import Link from "next/link";

const LINKS: ReadonlyArray<readonly [string, string]> = [
  ["#calc", "CALCULATOR"],
  ["#addons", "ADD-ONS"],
  ["#coverage", "COVERAGE"],
  ["#faq", "FAQ"],
];

export function FieldUnitNav() {
  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: "rgba(0,0,0,.85)",
        backdropFilter: "blur(12px)",
        borderColor: "var(--line)",
      }}
    >
      <div className="wrap flex items-center justify-between py-[18px] gap-6">
        <div className="flex items-center gap-[14px]">
          <Link href="/" className="mono text-[13px] tracking-[.14em] font-semibold">
            SITEPULSE
          </Link>
          <span className="mono text-[10.5px] tracking-[.16em] text-[var(--mute)] hidden sm:inline">
            / FIELD UNIT · v1
          </span>
        </div>
        <div className="flex items-center gap-5 md:gap-7">
          {LINKS.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="ulink mono text-[12px] tracking-[.1em] no-underline hidden md:inline"
            >
              {label}
            </a>
          ))}
          <a href="#reserve" className="btn btn-cy text-[12px] h-auto px-4 py-2">
            Reserve
          </a>
        </div>
      </div>
    </nav>
  );
}
