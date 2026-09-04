"use client";

import { track } from "@vercel/analytics";
import { affiliateUrl } from "@/lib/affiliate";
import { getAttributionSource } from "@/lib/attribution";
import type { Deal } from "@/types/deal";

export function StoreCta({ deal }: { deal: Deal }) {
  const href = affiliateUrl(deal.affiliateUrl || deal.storeUrl);

  if (deal.demo || !href) {
    return (
      <p className="text-sm text-muted">
        {deal.demo ? "דוגמת תצוגה — אין קישור חנות." : "אין קישור חנות לדיל הזה."}
      </p>
    );
  }

  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
      rel="noopener noreferrer nofollow sponsored"
      target="_blank"
      onClick={() =>
        track("affiliate_click", {
          slug: deal.slug,
          store: deal.storeName || deal.store || "unknown",
          source: getAttributionSource(),
        })
      }
    >
      לקנייה ב־{deal.storeName || "החנות"}
    </a>
  );
}
