import type { Metadata } from "next";
import { DealGrid } from "@/components/DealGrid";
import { PageHero } from "@/components/PageHero";
import { getAllDeals } from "@/lib/deals";

export const metadata: Metadata = {
  title: "כל הדילים",
};

export default function DealsPage() {
  return (
    <>
      <PageHero title="כל הדילים" subtitle="המחיר הסופי בשקלים קודם. לוחצים וקונים." />
      <DealGrid deals={getAllDeals()} />
    </>
  );
}
