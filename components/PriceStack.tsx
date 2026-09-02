import { formatApproxIls, formatIls, formatOriginalPrice } from "@/lib/format";
import {
  displayIlsAmount,
  displayShippingNote,
  hasDisplayIls,
  primaryPriceLabel,
  resolvePriceKind,
  savingsIls,
} from "@/lib/pricing";
import { showsIsraelCompare } from "@/lib/stores";
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
  const kind = resolvePriceKind(deal);
  const note = kind === "item" ? displayShippingNote(deal) : undefined;
  const showCompare = showsIsraelCompare(deal);
  const saved = showCompare ? savingsIls(deal) : null;
  const label = primaryPriceLabel(deal);
  const ils = displayIlsAmount(deal);

  const original = deal.originalPrice;
  const hasOriginal =
    original != null &&
    typeof original.amount === "number" &&
    original.amount > 0 &&
    Boolean(original.currency);

  return (
    <div className="flex flex-col gap-1">
      {hasDisplayIls(deal) && ils != null ? (
        <>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">
            {label.labelHe}
          </p>
          <p className={primaryClass} dir="ltr">
            {formatApproxIls(ils)}
          </p>
        </>
      ) : hasOriginal && original ? (
        <p className={primaryClass} dir="ltr">
          {formatOriginalPrice(original.amount, original.currency)}
        </p>
      ) : (
        <p className="text-sm text-muted">המחיר יפורסם בהמשך</p>
      )}
      {showCompare && deal.compareIls ? (
        <p className="text-sm text-muted line-through">
          {formatIls(deal.compareIls)} בארץ
        </p>
      ) : null}
      {saved ? (
        <p className="text-sm font-semibold text-danger">
          חיסכון {formatIls(saved)}
        </p>
      ) : null}
      {note ? <p className="text-sm text-muted">{note}</p> : null}
    </div>
  );
}
