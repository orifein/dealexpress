import Link from "next/link";
import { DealGrid } from "@/components/DealGrid";
import { FollowSocials } from "@/components/FollowSocials";
import { PageHero } from "@/components/PageHero";
import { StoreFilters } from "@/components/StoreFilters";
import { missingRealDeals } from "@/lib/assert-deals";
import { getRealDeals } from "@/lib/deals";
import { site } from "@/lib/site";
import { filterDealsByStore, parseStoreFilter, storeHref } from "@/lib/stores";

const HOMEPAGE_DEAL_LIMIT = 20;

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const missing = missingRealDeals();
  if (missing.length > 0) {
    throw new Error(`חסרים דילים אמיתיים: ${missing.join(", ")}`);
  }

  const params = await searchParams;
  const store = parseStoreFilter(params.store);
  const deals = filterDealsByStore(getRealDeals(), store);
  const visibleDeals = deals.slice(0, HOMEPAGE_DEAL_LIMIT);
  const hasMore = deals.length > HOMEPAGE_DEAL_LIMIT;

  return (
    <div className="space-y-12">
      <section className="rounded-3xl border border-line bg-card px-6 py-10 md:px-10">
        <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-brand">
          {site.brandEn}
        </p>
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight text-brand md:text-5xl">
          {site.taglineHe}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">{site.descriptionHe}</p>
        <div className="mt-6">
          <FollowSocials />
        </div>
      </section>

      <section>
        <PageHero title="הדילים עכשיו" subtitle="המחיר הסופי בשקלים קודם. לוחצים וקונים." />
        <StoreFilters active={store} basePath="/" />
        <DealGrid deals={visibleDeals} empty="אין דילים בחנות הזו כרגע." />
        {hasMore ? (
          <div className="mt-8 flex justify-center">
            <Link
              href={storeHref("/deals", store)}
              className="rounded-full bg-navy px-8 py-3 text-sm font-bold text-white transition hover:bg-navy/90"
            >
              הצגת כל הדילים ({deals.length})
            </Link>
          </div>
        ) : null}
      </section>
    </div>
  );
}
