"use client";

import { useCallback, useEffect, useState } from "react";
import { EmailSignup } from "./EmailSignup";

const STORAGE_KEY = "sitepulse:newsletter-dismissed";
const SHOW_DELAY_MS = 6000;

export function NewsletterPopup() {
  const [open, setOpen] = useState(false);

  const dismiss = useCallback(() => {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // localStorage unavailable (private mode) — closing for this session is fine.
    }
  }, []);

  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) return;

    const timer = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-title"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={dismiss}
      />
      <div
        className="relative w-full max-w-[460px] border bg-black p-8 md:p-10"
        style={{ borderColor: "var(--line-strong)" }}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-4 right-4 text-zinc-500 hover:text-[var(--hi)] transition-colors text-[18px] leading-none"
        >
          ×
        </button>

        <div className="mono text-[11px] tracking-[.2em] uppercase text-[var(--hi)]">
          Field dispatch
        </div>
        <h2
          id="newsletter-title"
          className="display mt-5 text-[26px] tracking-[-.025em] leading-[1.1]"
        >
          Get the reservation &amp; field-test updates.
        </h2>
        <p className="mt-4 text-[14px] leading-[1.6] text-zinc-400">
          Occasional email from the Yakima plant — build progress, run-time data
          from the field, and first word when new reservation slots open.
        </p>

        <div className="mt-7">
          <EmailSignup />
        </div>
      </div>
    </div>
  );
}
