"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/**
 * Mounted once in the root layout. Reads window.location.search directly
 * (rather than useSearchParams) so it needs no Suspense boundary and only
 * runs on the real entry page load, which is exactly when a utm_source from
 * an outbound share link is present.
 */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution(window.location.search);
  }, []);

  return null;
}
