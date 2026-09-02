import { DealGrid } from "@/components/DealGrid";
import { DealHero } from "@/components/DealHero";
import { getRelatedDeals } from "@/lib/deals";
import { site } from "@/lib/site";
import type { Deal } from "@/types/deal";

export function DealDetail({ deal }: { deal: Deal }) {
  const related = getRelatedDeals(deal);
  const specs = deal.specs ?? [];
  const warnings = deal.warnings ?? [];

  return (
    <article className="space-y-12">
      <DealHero deal={deal} />
      {deal.highlightsHe.length > 0 ? (
        <section>
          <h2 className="mb-4 text-2xl font-bold text-navy">למה זה דיל</h2>
          <ul className="list-disc space-y-2 pe-5 text-lg">
            {deal.highlightsHe.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {specs.length > 0 ? (
        <section>
          <h2 className="mb-4 text-2xl font-bold text-navy">פרטים</h2>
          <ul className="list-disc space-y-2 pe-5 text-lg">
            {specs.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {warnings.length > 0 ? (
        <section>
          <h2 className="mb-4 text-2xl font-bold text-navy">שימו לב</h2>
          <ul className="list-disc space-y-2 pe-5 text-lg">
            {warnings.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}
      <p className="text-sm text-muted">{site.usdIlsNoteHe}</p>
      {related.length > 0 ? (
        <section>
          <h2 className="mb-4 text-2xl font-bold text-navy">עוד באותה קטגוריה</h2>
          <DealGrid deals={related} />
        </section>
      ) : null}
    </article>
  );
}
