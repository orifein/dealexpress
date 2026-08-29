import { DealGrid } from "@/components/DealGrid";
import { FollowFacebook } from "@/components/FollowFacebook";
import { PageHero } from "@/components/PageHero";
import { missingRealDeals } from "@/lib/assert-deals";
import { getDemoDeals, getRealDeals } from "@/lib/deals";
import { site } from "@/lib/site";

export default function HomePage() {
  const missing = missingRealDeals();
  if (missing.length > 0) {
    throw new Error(`חסרים דילים אמיתיים: ${missing.join(", ")}`);
  }

  const realDeals = getRealDeals();
  const demoDeals = getDemoDeals();

  return (
    <div className="space-y-12">
      <section className="rounded-3xl bg-navy px-6 py-10 text-paper md:px-10">
        <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-gold">
          {site.brandEn}
        </p>
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight md:text-5xl">
          {site.taglineHe}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-paper/80">{site.descriptionHe}</p>
        <div className="mt-6">
          <FollowFacebook />
        </div>
      </section>

      <section>
        <PageHero title="הדילים עכשיו" subtitle="המחיר הסופי בשקלים קודם. לוחצים וקונים." />
        <DealGrid deals={realDeals} empty="עדיין אין דילים אמיתיים." />
      </section>

      <section>
        <PageHero
          title="דוגמאות תצוגה"
          subtitle="שישה כרטיסי דמו לבדיקת העיצוב. לא לקנייה."
        />
        <DealGrid deals={demoDeals} />
      </section>
    </div>
  );
}
