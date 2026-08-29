import { DealCard } from "@/components/DealCard";
import { EmptyDeals } from "@/components/EmptyDeals";
import type { Deal } from "@/types/deal";

export function DealGrid({
  deals,
  empty = "אין דילים בקטגוריה הזו כרגע.",
}: {
  deals: Deal[];
  empty?: string;
}) {
  if (deals.length === 0) {
    return <EmptyDeals message={empty} />;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {deals.map((deal) => (
        <DealCard key={deal.slug} deal={deal} />
      ))}
    </div>
  );
}
