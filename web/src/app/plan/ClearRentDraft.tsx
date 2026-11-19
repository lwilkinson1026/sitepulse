"use client";

import { useEffect } from "react";

/** Once a subscription is paid, the saved /plan draft has done its job. */
export function ClearRentDraft() {
  useEffect(() => {
    try {
      sessionStorage.removeItem("sp-rent-draft");
    } catch {
      // Storage blocked — nothing to clear.
    }
  }, []);
  return null;
}
