"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";

/**
 * First-visit intro: the unit on the runway at day, dusk and night, crossfading
 * like a time-lapse under a slow push-in, one line of copy per scene, then the
 * wordmark before it lifts off the home page.
 *
 * Whether it plays is decided before first paint by INTRO_GATE (rendered
 * inline from page.tsx), which sets <html data-intro="play|skip">. The overlay
 * is display:none unless it's "play", so repeat visits in the same session,
 * deep links (/#config) and reduced-motion users never see a flash of it — and
 * because the photos are CSS backgrounds, a hidden overlay never fetches them.
 */

const SEEN_KEY = "sp-intro-seen";

export const INTRO_GATE = `(function(){var d=document.documentElement,s="skip";try{if(!sessionStorage.getItem("${SEEN_KEY}")&&!location.hash&&!matchMedia("(prefers-reduced-motion: reduce)").matches)s="play"}catch(e){}d.dataset.intro=s})()`;

const SCENES = [
  {
    src: "/assets/intro-day.jpg",
    clock: "14:00",
    eyebrow: "Battery · 2,000 W pure-sine",
    line: "Power where the grid ends.",
  },
  {
    src: "/assets/intro-dusk.jpg",
    clock: "19:42",
    eyebrow: "79cc engine · ~1.5 hr a day",
    line: "Tops itself off. Then goes quiet.",
  },
  {
    src: "/assets/intro-night.jpg",
    clock: "02:15",
    eyebrow: "Starlink Mini · ~35 hr silent",
    line: "Online all night.",
  },
] as const;

const FINAL = SCENES.length;
const SCENE_MS = 2600;
const FINAL_MS = 1900;
const EXIT_MS = 900;
const FAST_EXIT_MS = 450;
// On a job-site connection the first photo may crawl in; don't hold the page.
const LOAD_TIMEOUT_MS = 2500;

type Exit = "slow" | "fast";

export function Intro() {
  // -1 while the first photo loads, 0..2 for the scenes, FINAL for the wordmark.
  const [step, setStep] = useState(-1);
  const [exit, setExit] = useState<Exit | null>(null);
  const [gone, setGone] = useState(false);

  const leave = useCallback((speed: Exit) => {
    setExit((current) => current ?? speed);
  }, []);

  // Start once the first photo has loaded; warm the other two meanwhile.
  useEffect(() => {
    if (document.documentElement.dataset.intro !== "play") return;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}

    // Not img.decode(): it stalls until the tab is painted, so a tab opened in
    // the background would trip the timeout below.
    const photos = SCENES.map((s) => {
      const img = new Image();
      img.src = s.src;
      return img;
    });
    const first = photos[0];
    const start = () => {
      clearTimeout(timeout);
      setStep((s) => (s < 0 ? 0 : s));
    };
    const timeout = setTimeout(() => leave("fast"), LOAD_TIMEOUT_MS);

    if (first.complete) start();
    else {
      first.addEventListener("load", start, { once: true });
      first.addEventListener("error", () => leave("fast"), { once: true });
    }

    return () => {
      clearTimeout(timeout);
      first.removeEventListener("load", start);
    };
  }, [leave]);

  // Advance the timeline.
  useEffect(() => {
    if (step < 0 || exit) return;
    const t = setTimeout(
      () => (step < FINAL ? setStep(step + 1) : leave("slow")),
      step < FINAL ? SCENE_MS : FINAL_MS,
    );
    return () => clearTimeout(t);
  }, [step, exit, leave]);

  // Any intent to get at the page skips straight to it.
  useEffect(() => {
    if (step < 0 || exit) return;
    const skip = () => leave("fast");
    const onKey = (e: KeyboardEvent) => {
      if (["Escape", "Enter", " ", "ArrowDown", "PageDown"].includes(e.key)) {
        e.preventDefault();
        skip();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchmove", skip, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchmove", skip);
    };
  }, [step, exit, leave]);

  // Fade out, then hand the page back.
  useEffect(() => {
    if (!exit) return;
    const t = setTimeout(
      () => {
        document.documentElement.dataset.intro = "done";
        window.scrollTo(0, 0);
        setGone(true);
      },
      exit === "fast" ? FAST_EXIT_MS : EXIT_MS,
    );
    return () => clearTimeout(t);
  }, [exit]);

  if (gone) return null;

  const shown = Math.min(step, SCENES.length - 1);

  return (
    <section
      aria-label="Sitepulse intro"
      className="sp-intro"
      data-running={step >= 0 || undefined}
      data-exit={exit ?? undefined}
      onClick={() => step >= 0 && leave("fast")}
      style={
        {
          "--scene-ms": `${SCENE_MS}ms`,
          "--exit-ms": `${exit === "fast" ? FAST_EXIT_MS : EXIT_MS}ms`,
        } as CSSProperties
      }
    >
      <div className="sp-intro-media">
        {SCENES.map((s, i) => (
          <div
            key={s.src}
            className="sp-intro-photo"
            data-on={i === 0 || i <= shown || undefined}
            style={{ backgroundImage: `url(${s.src})` }}
          />
        ))}
      </div>
      <div className="sp-intro-scrim" />

      {/* Top rail: identity + clock, skip */}
      <div className="absolute top-0 inset-x-0 px-5 sm:px-8 pt-5 sm:pt-7 flex items-start justify-between mono text-[10px] sm:text-[11px] tracking-[.22em] uppercase text-zinc-300">
        <div>
          <div className="font-bold tracking-[.06em] text-[14px] sm:text-[16px] text-white font-sans">
            SITEPULSE
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="pulse-dot" />
            <span>UNIT-001 · YAKIMA, WA</span>
            <span className="sp-intro-clock text-white" data-on={step >= 0 || undefined}>
              {SCENES[Math.max(shown, 0)].clock}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            leave("fast");
          }}
          className="ulink text-zinc-300 hover:text-white transition-colors py-1"
        >
          Skip intro →
        </button>
      </div>

      {/* Scene copy */}
      <div className="absolute inset-x-0 bottom-0 px-5 sm:px-8 pb-16 sm:pb-20">
        <div className="max-w-[1440px] mx-auto grid items-end">
          {SCENES.map((s, i) => (
            <div
              key={s.clock}
              className="sp-intro-copy [grid-area:1/1]"
              data-on={i === step || undefined}
            >
              <div className="mono text-[11px] sm:text-[12px] tracking-[.22em] uppercase text-zinc-300">
                {s.eyebrow}
              </div>
              <div
                className="display-x mt-3 leading-[.95] text-white"
                style={{ fontSize: "clamp(40px, 7vw, 104px)" }}
              >
                {s.line}
              </div>
            </div>
          ))}
          <div
            className="sp-intro-copy [grid-area:1/1]"
            data-on={step === FINAL || undefined}
          >
            <div className="mono text-[11px] sm:text-[12px] tracking-[.22em] uppercase text-zinc-300">
              Battery · Starlink · Generator
            </div>
            <div
              className="display-x mt-3 leading-[.95] text-white"
              style={{ fontSize: "clamp(40px, 7vw, 104px)" }}
            >
              Silent for days.
              <br />
              <span className="text-glow">Online forever.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="absolute inset-x-0 bottom-0 px-5 sm:px-8 pb-6 sm:pb-8">
        <div className="max-w-[1440px] mx-auto grid grid-cols-3 gap-2">
          {SCENES.map((s, i) => (
            <div key={s.clock} className="sp-intro-seg">
              <div
                data-state={i < step ? "done" : i === step ? "active" : undefined}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
