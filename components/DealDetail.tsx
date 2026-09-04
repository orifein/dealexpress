import { DealGrid } from "@/components/DealGrid";
import { DealHero } from "@/components/DealHero";
import { getRelatedDeals } from "@/lib/deals";
import { isIsraelCompareCopy, showsIsraelCompare } from "@/lib/stores";
import { site } from "@/lib/site";
import type { Deal } from "@/types/deal";

const URL_PATTERN = /(https?:\/\/[^\s]+)/g;

function linkifyText(text: string) {
  // split() with a capturing group interleaves matches at odd indices.
  const parts = text.split(URL_PATTERN);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <a
        key={i}
        href={part}
        className="underline"
        rel="noopener noreferrer nofollow"
        target="_blank"
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}

export function DealDetail({ deal }: { deal: Deal }) {
  const related = getRelatedDeals(deal);
  const allowIsrael = showsIsraelCompare(deal);
  const specs = (deal.specs ?? []).filter((item) => allowIsrael || !isIsraelCompareCopy(item));
  const warnings = deal.warnings ?? [];
  const highlights = deal.highlightsHe.filter(
    (item) => allowIsrael || !isIsraelCompareCopy(item),
  );

  return (
    <article className="space-y-12">
      <DealHero deal={deal} />
      {highlights.length > 0 ? (
        <section>
          <h2 className="mb-4 text-2xl font-bold text-navy">למה זה דיל</h2>
          <ul className="list-disc space-y-2 pe-5 text-lg">
            {highlights.map((item) => (
              <li key={item}>{linkifyText(item)}</li>
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
        <section className="rounded-2xl border border-brand/40 bg-card px-5 py-5">
          <h2 className="mb-4 text-2xl font-bold text-brand">שימו לב</h2>
          <ul className="list-disc space-y-2 pe-5 text-lg">
            {warnings.map((item) => (
              <li
                key={item}
                className={
                  /retourenkauf|used like new/i.test(item)
                    ? "font-semibold text-brand"
                    : undefined
                }
              >
                {item}
              </li>
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
