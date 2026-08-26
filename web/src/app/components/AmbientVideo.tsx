"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  poster?: string;
  label: string;
  className?: string;
};

/**
 * Decorative hero loop that stays out of the critical path.
 *
 * These 21:9 loops are multi-megabyte files. As a plain `<video autoPlay
 * preload="auto">` Chrome — desktop and Android — pulls the whole file down as
 * part of the initial navigation, so the tab spinner keeps turning (and the
 * video hogs the connection) until the last byte lands. Safari defers that
 * fetch, which is why the stall only ever showed up off-Apple.
 *
 * Here the poster paints on first render and `src` is attached only once the
 * page has finished loading *and* the element is on screen.
 */
export function AmbientVideo({ src, poster, label, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let observer: IntersectionObserver | undefined;

    const arm = () => {
      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer?.disconnect();
          setActive(true);
        },
        { rootMargin: "200px" },
      );
      observer.observe(el);
    };

    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });

    return () => {
      observer?.disconnect();
      window.removeEventListener("load", arm);
    };
  }, []);

  // muted + playsInline keeps this inside every browser's autoplay policy.
  useEffect(() => {
    if (active) ref.current?.play().catch(() => {});
  }, [active]);

  return (
    <video
      ref={ref}
      src={active ? src : undefined}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      className={className}
    />
  );
}
