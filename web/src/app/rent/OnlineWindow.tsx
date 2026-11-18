"use client";

import { useEffect, useState } from "react";
import { ONLINE_MAX_HOURS, ONLINE_MIN_HOURS } from "@/lib/rental";

const FMT: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
};

/**
 * The concrete delivery window, in the visitor's own time zone. With `fromMs`
 * it's anchored to the moment of payment; without, to "if you commit now".
 * Rendered after mount so server and browser clocks can't disagree.
 */
export function OnlineWindow({ fromMs }: { fromMs?: number }) {
  const [start, setStart] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setStart(fromMs ?? Date.now());
    tick();
    if (fromMs != null) return;
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [fromMs]);

  if (start == null) {
    return <span className="num">—</span>;
  }

  const at = (h: number) =>
    new Date(start + h * 3_600_000).toLocaleString(undefined, FMT);

  return (
    <span className="num">
      {at(ONLINE_MIN_HOURS)} <span className="text-[var(--mute)]">→</span>{" "}
      {at(ONLINE_MAX_HOURS)}
    </span>
  );
}
