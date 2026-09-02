import { affiliateUrl } from "@/lib/affiliate";
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
      className="inline-flex items-center justify-center rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-paper hover:bg-ink"
      rel="noopener noreferrer sponsored"
      target="_blank"
    >
      לקנייה ב־{deal.storeName || "החנות"}
    </a>
  );
}
