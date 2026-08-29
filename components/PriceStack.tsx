import { formatApproxIls, formatIls } from "@/lib/format";
import { hasLandedPrice, savingsIls } from "@/lib/pricing";
import type { Deal } from "@/types/deal";

export function PriceStack({
  deal,
  size = "card",
}: {
  deal: Deal;
  size?: "card" | "detail";
}) {
  const primaryClass =
    size === "detail"
      ? "text-4xl font-extrabold tracking-tight text-navy"
      : "text-2xl font-extrabold tracking-tight text-navy";
  const saved = savingsIls(deal);

  if (!hasLandedPrice(deal) || deal.landedIls == null) {
    return (
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted">המחיר יפורסם בהמשך</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-gold">
        מחיר סופי
      </p>
      <p className={primaryClass} dir="ltr">
        {formatApproxIls(deal.landedIls)}
      </p>
      {deal.compareIls ? (
        <p className="text-sm text-muted line-through">
          {formatIls(deal.compareIls)} בארץ
        </p>
      ) : null}
      {saved ? (
        <p className="text-sm font-semibold text-danger">
          חיסכון {formatIls(saved)}
        </p>
      ) : null}
    </div>
  );
}
