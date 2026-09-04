/**
 * Session-scoped channel attribution for revenue tracking. We capture
 * `utm_source` from the landing URL (Telegram/Facebook/WhatsApp links all
 * carry one) so a later affiliate-link click — possibly on a different page,
 * after in-site navigation — can still be attributed back to the channel
 * that brought the visitor in. sessionStorage keeps this per-tab and gone
 * once the visit ends; we deliberately never overwrite an existing value so
 * mid-session browsing without utm params doesn't erase the original source.
 */

const KEY = "dx_attribution_source";

export function captureAttribution(search: string): void {
  if (typeof window === "undefined") return;

  const source = new URLSearchParams(search).get("utm_source");
  if (!source) return;

  try {
    if (!sessionStorage.getItem(KEY)) {
      sessionStorage.setItem(KEY, source);
    }
  } catch {
    // sessionStorage unavailable (private mode, blocked storage) — skip.
  }
}

export function getAttributionSource(): string {
  if (typeof window === "undefined") return "direct";

  try {
    return sessionStorage.getItem(KEY) || "direct";
  } catch {
    return "direct";
  }
}
