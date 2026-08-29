import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DealGrid } from "@/components/DealGrid";
import { DealHero } from "@/components/DealHero";
import { getAllDeals, getDealBySlug, getRelatedDeals } from "@/lib/deals";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return getAllDeals().map((deal) => ({ slug: deal.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/deals/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const deal = getDealBySlug(slug);
  if (!deal) {
    return { title: "דיל לא נמצא" };
  }
  return {
    title: deal.titleHe,
    description: deal.summaryHe,
  };
}

export default async function DealPage({ params }: PageProps<"/deals/[slug]">) {
  const { slug } = await params;
  const deal = getDealBySlug(slug);
  if (!deal) {
    notFound();
  }

  const related = getRelatedDeals(deal);

  return (
    <article className="space-y-12">
      <DealHero deal={deal} />
      <section>
        <h2 className="mb-4 text-2xl font-bold text-navy">למה זה דיל</h2>
        <ul className="list-disc space-y-2 pe-5 text-lg">
          {deal.highlightsHe.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
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
