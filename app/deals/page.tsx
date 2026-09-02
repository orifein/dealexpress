import type { Metadata } from "next";
import { DealGrid } from "@/components/DealGrid";
import { PageHero } from "@/components/PageHero";
import { StoreFilters } from "@/components/StoreFilters";
import { getAllDeals } from "@/lib/deals";
import { filterDealsByStore, parseStoreFilter } from "@/lib/stores";

export const metadata: Metadata = {
  title: "כל הדילים",
};

export default async function DealsPage({ searchParams }: PageProps<"/deals">) {
  const params = await searchParams;
  const store = parseStoreFilter(params.store);
  const deals = filterDealsByStore(getAllDeals(), store);

  return (
    <>
      <PageHero title="כל הדילים" subtitle="המחיר הסופי בשקלים קודם. לוחצים וקונים." />
      <StoreFilters active={store} basePath="/deals" />
      <DealGrid deals={deals} empty="אין דילים בחנות הזו כרגע." />
    </>
  );
}
