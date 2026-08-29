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
      <PageHero title="כל הדילים" subtitle="אמיתיים ודוגמאות תצוגה במקום אחד." />
      <DealGrid deals={getAllDeals()} />
    </>
  );
}
