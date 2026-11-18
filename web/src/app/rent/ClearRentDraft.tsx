"use client";

import { useEffect } from "react";

/** Once a rental is paid, the saved /rent draft has done its job. */
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
