"use client";

import { useId, useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "w-full bg-transparent border px-4 py-3 text-[15px] text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-[var(--hi)] transition-colors";

export function EmailSignup({ onSuccess }: { onSuccess?: () => void }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const consentId = useId();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      email: String(data.get("email") ?? "").trim(),
      consent: data.get("consent") === "on",
    };

    try {
      const res = await fetch("/api/subscribe", {
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
      onSuccess?.();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (status === "sent") {
    return (
      <p className="text-[14px] leading-[1.6] text-zinc-300">
        <span className="text-[var(--hi)]">You&rsquo;re on the list.</span>{" "}
        Watch your inbox for field updates and reservation news.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          aria-label="Email address"
          className={inputClass}
          style={{ borderColor: "var(--line-strong)" }}
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn btn-cy disabled:opacity-50 whitespace-nowrap"
        >
          {status === "sending" ? "Joining…" : "Notify me"} <span>→</span>
        </button>
      </div>

      <label
        htmlFor={consentId}
        className="mt-4 flex items-start gap-3 cursor-pointer"
      >
        <input
          id={consentId}
          name="consent"
          type="checkbox"
          required
          className="mt-0.5 accent-[var(--hi)]"
        />
        <span className="text-[12px] leading-[1.5] text-zinc-500">
          I agree to receive occasional email updates from Sitepulse. No spam;
          unsubscribe anytime.
        </span>
      </label>

      {error && (
        <p className="mt-3 mono text-[12px] tracking-[.04em] text-red-400">
          {error}
        </p>
      )}
    </form>
  );
}
