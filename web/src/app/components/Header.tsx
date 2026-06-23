import Link from "next/link";

const NAV_LINKS: ReadonlyArray<readonly [string, string]> = [
  ["The Unit", "/#unit"],
  ["How it Runs", "/#runs"],
  ["Specs", "/#specs"],
  ["DJI Dock", "/dji-dock"],
  ["Off-Grid", "/off-grid"],
  ["Configure", "/#config"],
];

export function Header() {
  return (
    <header
      className="fixed top-0 inset-x-0 z-40 border-b"
      style={{
        borderColor: "var(--line)",
        backdropFilter: "blur(14px)",
        background: "rgba(0,0,0,.65)",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-8 h-[68px] flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="font-bold tracking-[.06em] text-[16px]">SITEPULSE</span>
        </Link>
        <nav className="hidden md:flex items-center gap-9">
          {NAV_LINKS.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="ulink text-[13px] text-zinc-400 hover:text-white transition-colors uppercase tracking-[.08em] font-medium"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-5">
          <Link
            href="/contact"
            className="ulink hidden sm:inline text-[12px] uppercase tracking-[.1em] text-zinc-400 mono"
          >
            Dealers
          </Link>
          <Link href="/#config" className="btn btn-cy">
            RESERVE <span className="opacity-70">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
