"use client";

import { useState } from "react";

import { Eyebrow } from "../components/Eyebrow";

type Status = "idle" | "sending" | "error";

const inputClass =
  "mt-2 w-full bg-transparent border px-4 py-3 text-[15px] text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-[var(--hi)] transition-colors";

export function FieldGuideForm({ unlocked = false }: { unlocked?: boolean }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(unlocked);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const data = new FormData(e.currentTarget);
    const payload = {
      email: String(data.get("email") ?? "").trim(),
      company: String(data.get("company") ?? "").trim(),
      website: String(data.get("website") ?? "").trim(),
    };

    try {
      const res = await fetch("/api/field-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          body.error ?? "Something went wrong. Please try again.",
        );
      }
      setOpen(true);
      setStatus("idle");
      // The cookie is set, so the download route will serve the file.
      window.location.href = "/api/field-guide/download";
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (open) {
    return (
      <>
        <Eyebrow num="02" label="YOUR DOWNLOAD" />
        <div
          className="mt-8 border p-8 md:p-10"
          style={{ borderColor: "var(--line-strong)" }}
        >
          <div className="mono text-[11px] tracking-[.2em] uppercase text-[var(--hi)]">
            Guide unlocked
          </div>
          <h2 className="display mt-6 text-[28px] tracking-[-.025em] leading-[1.1]">
            Your download is ready.
          </h2>
          <p className="mt-4 text-[15px] leading-[1.6] text-zinc-400">
            The download should start on its own. If it doesn&rsquo;t, use the
            button below — this link stays open on this browser for 30 days.
          </p>
          <a
            href="/api/field-guide/download"
            className="btn btn-cy mt-8"
            download
          >
            DOWNLOAD THE PDF <span>↓</span>
          </a>
        </div>
      </>
    );
  }

  return (
    <>
      <Eyebrow num="02" label="UNLOCK THE PDF" />
      <form
        onSubmit={onSubmit}
        className="mt-8 border p-8 md:p-10"
        style={{ borderColor: "var(--line-strong)" }}
      >
        <div className="mono text-[10px] tracking-[.2em] uppercase text-zinc-500">
          Free · PDF · Print at home
        </div>
        <h2 className="display mt-4 text-[26px] tracking-[-.025em] leading-[1.15]">
          Where should we send it?
        </h2>

        <label className="block mt-8">
          <span className="mono text-[10px] tracking-[.18em] uppercase text-zinc-500">
            Email
          </span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className={inputClass}
            style={{ borderColor: "var(--line)" }}
          />
        </label>

        <label className="block mt-6">
          <span className="mono text-[10px] tracking-[.18em] uppercase text-zinc-500">
            Company / org <span className="text-zinc-700">(optional)</span>
          </span>
          <input
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="Where you work"
            className={inputClass}
            style={{ borderColor: "var(--line)" }}
          />
        </label>

        {/* Honeypot — hidden from people, tempting to bots. */}
        <div className="hidden" aria-hidden="true">
          <label>
            Website
            <input
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </div>

        {error && (
          <p className="mt-6 mono text-[12px] tracking-[.04em] text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="btn btn-cy mt-8 disabled:opacity-50"
        >
          {status === "sending" ? "Unlocking…" : "Get the field guide"}{" "}
          <span>→</span>
        </button>

        <p className="mt-6 text-[12px] leading-[1.6] text-zinc-600">
          We use your email to send occasional Sitepulse build and shipping
          updates. No spam, and you can opt out any time.
        </p>
      </form>
    </>
  );
}
