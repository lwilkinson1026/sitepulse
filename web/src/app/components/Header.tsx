"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS: ReadonlyArray<readonly [string, string]> = [
  ["The Unit", "/#unit"],
  ["How it Runs", "/#runs"],
  ["Specs", "/#specs"],
  ["Field Unit", "/field-unit"],
  ["DJI Dock", "/dji-dock"],
  ["Off-Grid", "/off-grid"],
  ["Configure", "/#config"],
];

export function Header() {
  const [open, setOpen] = useState(false);

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
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
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
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="md:hidden flex flex-col items-center justify-center w-10 h-10 -mr-2 gap-[5px]"
          >
            <span
              className="block w-5 h-[2px] bg-white transition-transform duration-200"
              style={open ? { transform: "translateY(7px) rotate(45deg)" } : undefined}
            />
            <span
              className="block w-5 h-[2px] bg-white transition-opacity duration-200"
              style={open ? { opacity: 0 } : undefined}
            />
            <span
              className="block w-5 h-[2px] bg-white transition-transform duration-200"
              style={open ? { transform: "translateY(-7px) rotate(-45deg)" } : undefined}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav
          className="md:hidden border-t"
          style={{ borderColor: "var(--line)", background: "rgba(0,0,0,.94)" }}
        >
          <div className="max-w-[1440px] mx-auto px-8 py-4 flex flex-col">
            {NAV_LINKS.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="py-3 text-[14px] text-zinc-300 hover:text-white transition-colors uppercase tracking-[.08em] font-medium border-b last:border-b-0"
                style={{ borderColor: "var(--line)" }}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="py-3 text-[14px] text-zinc-300 hover:text-white transition-colors uppercase tracking-[.08em] font-medium mono"
            >
              Dealers
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
