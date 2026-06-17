"use client";

import { useState } from "react";

const TOPICS = [
  "Reservations & pricing",
  "Technical / specs",
  "Dealers & distribution",
  "Field service & support",
  "Press & partnerships",
  "Other",
] as const;

type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "mt-2 w-full bg-transparent border px-4 py-3 text-[15px] text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-[var(--hi)] transition-colors";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      company: String(data.get("company") ?? "").trim(),
      topic: String(data.get("topic") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (status === "sent") {
    return (
      <div
        className="border p-10"
        style={{ borderColor: "var(--line-strong)" }}
      >
        <div className="mono text-[11px] tracking-[.2em] uppercase text-[var(--hi)]">
          Message received
        </div>
        <h3 className="display mt-6 text-[28px] tracking-[-.025em] leading-[1.1]">
          Thanks — we&rsquo;ll be in touch.
        </h3>
        <p className="mt-4 text-[15px] leading-[1.6] text-zinc-400">
          A real person reads every message. Expect a reply within two business
          days.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn btn-ghost mt-8"
        >
          ← Send another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="border p-8 md:p-10"
      style={{ borderColor: "var(--line-strong)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="block">
          <span className="mono text-[10px] tracking-[.18em] uppercase text-zinc-500">
            Name
          </span>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            className={inputClass}
            style={{ borderColor: "var(--line)" }}
          />
        </label>
        <label className="block">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <label className="block">
          <span className="mono text-[10px] tracking-[.18em] uppercase text-zinc-500">
            Company / org{" "}
            <span className="text-zinc-700">(optional)</span>
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
        <label className="block">
          <span className="mono text-[10px] tracking-[.18em] uppercase text-zinc-500">
            Topic
          </span>
          <select
            name="topic"
            defaultValue={TOPICS[0]}
            className={inputClass}
            style={{ borderColor: "var(--line)" }}
          >
            {TOPICS.map((t) => (
              <option key={t} value={t} className="bg-black">
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block mt-6">
        <span className="mono text-[10px] tracking-[.18em] uppercase text-zinc-500">
          Message
        </span>
        <textarea
          name="message"
          required
          rows={6}
          placeholder="Tell us about your site, your power needs, or your question."
          className={`${inputClass} resize-y`}
          style={{ borderColor: "var(--line)" }}
        />
      </label>

      {error && (
        <p className="mt-6 mono text-[12px] tracking-[.04em] text-red-400">
          {error}
        </p>
      )}

      <div className="mt-8 flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn btn-cy disabled:opacity-50"
        >
          {status === "sending" ? "Sending…" : "Send message"} <span>→</span>
        </button>
        <span className="mono text-[10px] tracking-[.18em] uppercase text-zinc-600">
          We reply within 2 business days
        </span>
      </div>
    </form>
  );
}
