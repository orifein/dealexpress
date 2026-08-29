import { DealImage } from "@/components/DealImage";
import { DemoBadge } from "@/components/DemoBadge";
import { PriceStack } from "@/components/PriceStack";
import { StoreCta } from "@/components/StoreCta";
import { categoryLabelsHe } from "@/lib/categories";
import { formatDateHe } from "@/lib/format";
import type { Deal } from "@/types/deal";

export function DealHero({ deal }: { deal: Deal }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-card">
        <DealImage
          src={deal.image}
          alt={deal.imageAltHe}
          className="h-full w-full object-cover"
          priority
        />
      </div>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          {deal.demo ? <DemoBadge /> : null}
          <span className="rounded-full bg-card px-3 py-1 text-sm">
            {categoryLabelsHe[deal.category]}
          </span>
          <span className="text-sm text-muted">{formatDateHe(deal.publishedAt)}</span>
        </div>
        <p className="text-sm font-semibold uppercase tracking-wide text-muted">
          {deal.brand}
          {deal.model ? ` · ${deal.model}` : ""}
        </p>
        <h1 className="text-3xl font-extrabold text-navy md:text-4xl">{deal.titleHe}</h1>
        <p className="text-lg text-muted">{deal.summaryHe}</p>
        <PriceStack deal={deal} size="detail" />
        {deal.shippingNoteHe ? (
          <p className="rounded-xl bg-card px-4 py-3 text-sm text-muted">
            {deal.shippingNoteHe}
          </p>
        ) : null}
        <StoreCta deal={deal} />
      </div>
    </div>
  );
}
