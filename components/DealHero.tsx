import { DealImage } from "@/components/DealImage";
import { PriceStack } from "@/components/PriceStack";
import { StoreCta } from "@/components/StoreCta";
import { categoryLabel } from "@/lib/categories";
import { formatDateHe } from "@/lib/format";
import { resolvePriceKind } from "@/lib/pricing";
import type { Deal } from "@/types/deal";

export function DealHero({ deal }: { deal: Deal }) {
  const summary =
    deal.summaryHe && deal.summaryHe !== deal.titleHe ? deal.summaryHe : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-white">
        <DealImage
          src={deal.image}
          alt={deal.imageAltHe}
          className="h-full w-full object-contain p-6"
          priority
        />
      </div>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          {(deal.badges ?? []).map((badge) => (
            <span
              key={badge}
              className="rounded-full bg-brand px-3 py-1 text-sm font-semibold text-white"
            >
              {badge}
            </span>
          ))}
          <span className="rounded-full border border-line bg-card px-3 py-1 text-sm">
            {categoryLabel(deal.category)}
          </span>
          {deal.storeName || deal.store ? (
            <span className="rounded-full border border-line bg-card px-3 py-1 text-sm">
              {deal.storeName || deal.store}
            </span>
          ) : null}
          <span className="text-sm text-muted">{formatDateHe(deal.publishedAt)}</span>
        </div>
        <p className="text-sm font-semibold uppercase tracking-wide text-muted">
          {deal.brand}
          {deal.model ? ` · ${deal.model}` : ""}
        </p>
        <h1 className="text-3xl font-extrabold text-navy md:text-4xl">{deal.titleHe}</h1>
        {summary ? <p className="text-lg text-muted">{summary}</p> : null}
        <PriceStack deal={deal} size="detail" />
        {resolvePriceKind(deal) === "landed" && deal.shippingNoteHe ? (
          <p className="rounded-xl bg-card px-4 py-3 text-sm text-muted">
            {deal.shippingNoteHe}
          </p>
        ) : null}
        {resolvePriceKind(deal) === "landed" && deal.freeShippingOver49 === true ? (
          <p className="text-sm text-muted">
            משלוח חינם זמין אם ההזמנה שלכם באמזון עוברת $49 (בפריטים נבחרים).
          </p>
        ) : null}
        <StoreCta deal={deal} />
      </div>
    </div>
  );
}
