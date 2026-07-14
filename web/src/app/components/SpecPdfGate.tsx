"use client";

import { useCallback, useEffect, useState } from "react";
import { EmailSignup } from "./EmailSignup";

const PDF_PATH = "/assets/sitepulse-spec-sheet.pdf";
const UNLOCK_KEY = "sitepulse:spec-pdf-unlocked";

function downloadPdf() {
  const a = document.createElement("a");
  a.href = PDF_PATH;
  a.download = "sitepulse-spec-sheet.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function SpecPdfGate() {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  const onButtonClick = () => {
    let unlocked = false;
    try {
      unlocked = localStorage.getItem(UNLOCK_KEY) === "1";
    } catch {
      unlocked = false;
    }
    if (unlocked) {
      downloadPdf();
    } else {
      setOpen(true);
    }
  };

  const onSuccess = () => {
    try {
      localStorage.setItem(UNLOCK_KEY, "1");
    } catch {
      // localStorage unavailable — download still works this session.
    }
    downloadPdf();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <>
      <button type="button" onClick={onButtonClick} className="btn btn-ghost">
        DOWNLOAD SPEC PDF
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="spec-pdf-title"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={close}
          />
          <div
            className="relative w-full max-w-[460px] border bg-black p-8 md:p-10"
            style={{ borderColor: "var(--line-strong)" }}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute top-4 right-4 text-zinc-500 hover:text-[var(--hi)] transition-colors text-[18px] leading-none"
            >
              ×
            </button>

            <div className="mono text-[11px] tracking-[.2em] uppercase text-[var(--hi)]">
              Spec sheet
            </div>
            <h2
              id="spec-pdf-title"
              className="display mt-5 text-[26px] tracking-[-.025em] leading-[1.1]"
            >
              Get the full technical spec sheet.
            </h2>
            <p className="mt-4 text-[14px] leading-[1.6] text-zinc-400">
              Enter your email and we&rsquo;ll unlock the PDF — plus occasional
              field-test data and first word when reservation slots open.
            </p>

            <div className="mt-7">
              <EmailSignup
                submitLabel="Email me the spec"
                sendingLabel="Unlocking…"
                onSuccess={onSuccess}
                successMessage={
                  <p>
                    <span className="text-[var(--hi)]">
                      Your download is starting.
                    </span>{" "}
                    If it doesn&rsquo;t,{" "}
                    <a
                      href={PDF_PATH}
                      download
                      className="underline hover:text-[var(--hi)]"
                    >
                      download the spec sheet
                    </a>
                    .
                  </p>
                }
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
