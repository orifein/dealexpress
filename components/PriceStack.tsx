import { formatIls, formatUsd } from "@/lib/format";
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

  return (
    <div className="flex flex-col gap-1">
      {hasLandedPrice(deal) && deal.landedIls != null ? (
        <>
          <p className="text-xs font-semibold uppercase tracking-wide text-gold">
            מחיר נחת
          </p>
          <p className={primaryClass}>{formatIls(deal.landedIls)}</p>
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
          {typeof deal.priceUsd === "number" ? (
            <p className="text-sm text-muted">
              בחנות: {formatUsd(deal.priceUsd)}
              {deal.listPriceUsd ? (
                <span className="ms-2 line-through">
                  {formatUsd(deal.listPriceUsd)}
                </span>
              ) : null}
            </p>
          ) : null}
        </>
      ) : typeof deal.priceUsd === "number" ? (
        <>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            מחיר בחנות
          </p>
          <p className={primaryClass}>{formatUsd(deal.priceUsd)}</p>
        </>
      ) : (
        <p className="text-sm text-muted">המחיר יפורסם בהמשך</p>
      )}
    </div>
  );
}
