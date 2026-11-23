"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  isNewsletterPopupExcluded,
  isPopupDismissedAt,
  NEWSLETTER_POPUP_DELAY_MS,
  NEWSLETTER_POPUP_SCROLL_RATIO,
  NEWSLETTER_POPUP_STORAGE_KEY,
  offerHeadline,
  parsePopupDismissedAt,
  scrollProgress,
  shouldTriggerNewsletterPopup,
  type NewsletterOffer,
} from "@/lib/newsletter";
import { captureEvent } from "@/lib/track-client";
import { NewsletterSignup } from "./NewsletterSignup";

let popupShownSent = false;

/**
 * Delayed, non-blocking signup sheet. Fixed-position so it cannot shift layout.
 * No page overlay — the rest of the site stays usable. Hidden on checkout and
 * contact, and remembered in localStorage for ~14 days after dismiss/signup.
 */
export function NewsletterPopup({ offer }: { offer: NewsletterOffer }) {
  const pathname = usePathname() ?? "/";
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const signedUpRef = useRef(false);
  const startRef = useRef(0);

  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [triggered, setTriggered] = useState(false);
  const [entered, setEntered] = useState(false);

  const excluded = isNewsletterPopupExcluded(pathname);
  const open = ready && !dismissed && !excluded && triggered;

  const persistDismiss = useCallback((hide = true) => {
    try {
      localStorage.setItem(NEWSLETTER_POPUP_STORAGE_KEY, String(Date.now()));
    } catch {
      // Private mode / blocked storage — still hide for this visit.
    }
    if (hide) setDismissed(true);
  }, []);

  const dismiss = useCallback(() => {
    if (!signedUpRef.current) {
      void captureEvent("newsletter_popup_dismissed", { source: "popup" });
    }
    persistDismiss();
  }, [persistDismiss]);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(NEWSLETTER_POPUP_STORAGE_KEY);
    } catch {
      stored = null;
    }
    const hidden = isPopupDismissedAt(parsePopupDismissedAt(stored), Date.now());
    setDismissed(hidden);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || dismissed || excluded || triggered) return;

    startRef.current = Date.now();
    const trigger = () => setTriggered(true);

    const maybeTrigger = () => {
      const elapsedMs = Date.now() - startRef.current;
      const ratio = scrollProgress(
        window.scrollY,
        window.innerHeight,
        document.documentElement.scrollHeight,
      );
      if (shouldTriggerNewsletterPopup({ elapsedMs, scrollRatio: ratio })) {
        trigger();
      }
    };

    const timeoutId = window.setTimeout(maybeTrigger, NEWSLETTER_POPUP_DELAY_MS);
    window.addEventListener("scroll", maybeTrigger, { passive: true });
    maybeTrigger();

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("scroll", maybeTrigger);
    };
  }, [ready, dismissed, excluded, triggered]);

  useEffect(() => {
    if (!open) {
      setEntered(false);
      return;
    }
    if (!popupShownSent) {
      popupShownSent = true;
      void captureEvent("newsletter_popup_shown", {
        source: "popup",
        delay_ms: NEWSLETTER_POPUP_DELAY_MS,
        scroll_threshold: NEWSLETTER_POPUP_SCROLL_RATIO,
        path: typeof window !== "undefined" ? window.location.pathname : pathname,
      });
      previousFocus.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
    }
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const id = window.setTimeout(
      () => {
        setEntered(true);
        panelRef.current?.focus();
      },
      reduceMotion ? 0 : 20,
    );
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        dismiss();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  useEffect(() => {
    if (open || !previousFocus.current) return;
    const node = previousFocus.current;
    previousFocus.current = null;
    node.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      aria-describedby={descId}
      tabIndex={-1}
      className={`nl-popup ${entered ? "nl-popup-in" : ""}`}
    >
      <div className="nl-popup-handle" aria-hidden="true" />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mono text-[10px] tracking-[.2em] uppercase text-zinc-500">
            Occasional notes · No spam
          </div>
          <h2
            id={titleId}
            className="display mt-2 text-[20px] tracking-[-.025em] leading-[1.2]"
          >
            Keep up with SitePulse
          </h2>
          <p id={descId} className="mt-2 text-[13px] leading-[1.5] text-zinc-400">
            {offerHeadline(offer.amountUsd)}. Enter the code at checkout.
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close newsletter signup"
          className="flex-none -mr-1 -mt-1 flex h-11 w-11 items-center justify-center text-zinc-400 hover:text-white"
        >
          <span aria-hidden="true" className="text-[22px] leading-none">
            ×
          </span>
        </button>
      </div>
      <div className="mt-4">
        <NewsletterSignup
          offer={offer}
          source="popup"
          variant="popup"
          onComplete={() => {
            signedUpRef.current = true;
            persistDismiss(false);
          }}
        />
      </div>
    </div>
  );
}
