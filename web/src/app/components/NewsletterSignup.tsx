"use client";

import { useState } from "react";
import { metaIdsForRequest } from "@/lib/attribution-browser";
import {
  formatOfferUsd,
  offerHeadline,
  type NewsletterOffer,
} from "@/lib/newsletter";
import { captureEvent, identifyPerson, track } from "@/lib/track-client";
import { newEventId } from "@/lib/tracking";

type Status = "idle" | "sending" | "sent" | "duplicate" | "error";
type Variant = "section" | "footer" | "popup";

const inputClass =
  "mt-2 w-full bg-transparent border px-4 py-3 text-[15px] text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-[var(--hi)] transition-colors";

export function NewsletterSignup({
  offer,
  source,
  variant = "section",
  onComplete,
}: {
  offer: NewsletterOffer;
  source: string;
  variant?: Variant;
  onComplete?: () => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const dollars = formatOfferUsd(offer.amountUsd);
  const compact = variant === "footer";
  const popup = variant === "popup";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      email: String(data.get("email") ?? "").trim(),
      firstName: String(data.get("firstName") ?? "").trim(),
      website: String(data.get("website") ?? "").trim(),
      event_id: newEventId("lead"),
      source,
      ...metaIdsForRequest(),
    };

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => ({}))) as {
        error?: string;
        duplicate?: boolean;
      };
      if (!res.ok) {
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }
      if (body.duplicate) {
        setStatus("duplicate");
        onComplete?.();
        return;
      }
      void identifyPerson(payload.email, {
        ...(payload.firstName ? { firstName: payload.firstName } : {}),
      });
      void captureEvent("newsletter_signup", {
        email: payload.email,
        first_name: payload.firstName || undefined,
        source,
        discount_code: offer.code,
        discount_amount_usd: offer.amountUsd,
      });
      track("Lead", {
        event_id: payload.event_id,
        email: payload.email,
        firstName: payload.firstName || undefined,
        extra: { lead_type: "newsletter", source },
        capi: false,
      });
      setStatus("sent");
      onComplete?.();
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (status === "sent" || status === "duplicate") {
    return (
      <div className={compact || popup ? "py-1" : ""} role="status">
        <div className="mono text-[11px] tracking-[.2em] uppercase text-[var(--hi)]">
          {status === "duplicate" ? "Already subscribed" : "You're on the list"}
        </div>
        <p
          className={`mt-3 text-zinc-300 ${compact || popup ? "text-[14px] leading-[1.5]" : "text-[16px] leading-[1.6]"}`}
        >
          {status === "duplicate"
            ? `You're already signed up. Check your inbox if you're looking for the ${dollars} off delivery code.`
            : `Thanks — check your inbox for the ${dollars} off delivery code. Enter it on the review step when you start a subscription.`}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      {!compact && !popup && (
        <>
          <div className="mono text-[10px] tracking-[.2em] uppercase text-zinc-500">
            Occasional notes · No spam
          </div>
          <h2 className="display mt-4 text-[26px] sm:text-[32px] tracking-[-.025em] leading-[1.15]">
            Keep up with SitePulse
          </h2>
          <p className="mt-3 text-[15px] leading-[1.6] text-zinc-400">
            {offerHeadline(offer.amountUsd)}. We&apos;ll email the code — enter
            it at checkout.
          </p>
        </>
      )}

      <div
        className={`grid grid-cols-1 ${
          compact
            ? "sm:grid-cols-[1fr_1.4fr_auto] gap-3"
            : popup
              ? "gap-3"
              : "sm:grid-cols-2 gap-4 mt-8"
        }`}
      >
        <label className="block">
          <span className="mono text-[10px] tracking-[.18em] uppercase text-zinc-500">
            First name <span className="text-zinc-700">(optional)</span>
          </span>
          <input
            name="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="First name"
            className={popup ? `${inputClass} !py-2.5 text-[14px]` : inputClass}
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
            inputMode="email"
            placeholder="you@company.com"
            className={popup ? `${inputClass} !py-2.5 text-[14px]` : inputClass}
            style={{ borderColor: "var(--line)" }}
          />
        </label>
        {(compact || popup) && (
          <div className={`flex items-end ${popup ? "mt-1" : ""}`}>
            <SubmitButton
              sending={status === "sending"}
              dollars={dollars}
              compact={compact}
              fullWidth={popup}
            />
          </div>
        )}
      </div>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {error && (
        <p className="mt-4 mono text-[12px] tracking-[.04em] text-red-400" role="alert">
          {error}
        </p>
      )}

      {!compact && !popup && (
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <SubmitButton sending={status === "sending"} dollars={dollars} compact={false} />
          <span className="mono text-[10px] tracking-[.18em] uppercase text-zinc-600">
            Code arrives by email
          </span>
        </div>
      )}
    </form>
  );
}

function SubmitButton({
  sending,
  dollars,
  compact,
  fullWidth,
}: {
  sending: boolean;
  dollars: string;
  compact: boolean;
  fullWidth?: boolean;
}) {
  const widthClass = fullWidth
    ? "w-full whitespace-nowrap"
    : compact
      ? "w-full sm:w-auto whitespace-nowrap"
      : "";
  return (
    <button
      type="submit"
      disabled={sending}
      className={`btn btn-cy disabled:opacity-50 ${widthClass}`}
    >
      {sending ? "Sending…" : `Get ${dollars} off`} <span>→</span>
    </button>
  );
}
