"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { bootstrapTracking, track } from "@/lib/track-client";
import {
  newEventId,
  PRODUCT,
  VIEW_CONTENT_PATHS,
} from "@/lib/tracking";

// Module-level so React Strict Mode remounts reuse the same event_id (Meta
// dedupes; we also skip firing twice for PostHog).
let lastPath = "";
let lastPageviewId = "";
let lastViewContentId = "";
const fired = new Set<string>();

/**
 * Mounts once in the root layout. Captures UTMs / click IDs, loads Meta +
 * PostHog only when their public env vars are set, and fires PageView (plus
 * ViewContent on product pages) on every client navigation.
 */
export function TrackingBootstrap() {
  const pathname = usePathname();

  useEffect(() => {
    bootstrapTracking();

    if (lastPath !== pathname) {
      lastPath = pathname;
      lastPageviewId = newEventId("pv");
      lastViewContentId = newEventId("vc");
    }

    if (!fired.has(lastPageviewId)) {
      fired.add(lastPageviewId);
      track("PageView", { event_id: lastPageviewId });
    }

    if (VIEW_CONTENT_PATHS.has(pathname) && !fired.has(lastViewContentId)) {
      fired.add(lastViewContentId);
      track("ViewContent", {
        event_id: lastViewContentId,
        value: PRODUCT.value_monthly,
        currency: PRODUCT.currency,
        extra: { page_path: pathname },
      });
    }
  }, [pathname]);

  return null;
}
