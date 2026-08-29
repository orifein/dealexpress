import Link from "next/link";
import { DealImage } from "@/components/DealImage";
import { DemoBadge } from "@/components/DemoBadge";
import { PriceStack } from "@/components/PriceStack";
import { categoryLabelsHe } from "@/lib/categories";
import type { Deal } from "@/types/deal";

export function DealCard({ deal }: { deal: Deal }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-sm">
      <Link href={`/deals/${deal.slug}`} className="relative block aspect-[4/3] bg-paper">
        <DealImage
          src={deal.image}
          alt={deal.imageAltHe}
          className="h-full w-full object-cover"
        />
        <div className="absolute start-3 top-3 flex gap-2">
          {deal.demo ? <DemoBadge /> : null}
          <span className="rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold text-navy">
            {categoryLabelsHe[deal.category]}
          </span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {deal.brand}
          </p>
          <h2 className="mt-1 text-lg font-bold leading-snug">
            <Link href={`/deals/${deal.slug}`} className="hover:text-gold">
              {deal.titleHe}
            </Link>
          </h2>
        </div>
        <PriceStack deal={deal} />
        <Link
          href={`/deals/${deal.slug}`}
          className="mt-auto text-sm font-semibold text-navy underline decoration-gold"
        >
          פרטי הדיל
        </Link>
      </div>
    </article>
  );
}
