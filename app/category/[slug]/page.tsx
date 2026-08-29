import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DealGrid } from "@/components/DealGrid";
import { PageHero } from "@/components/PageHero";
import { categoryLabelsHe, categoryOrder } from "@/lib/categories";
import { getDealsByCategory } from "@/lib/deals";
import type { DealCategory } from "@/types/deal";

function isCategory(value: string): value is DealCategory {
  return categoryOrder.includes(value as DealCategory);
}

export function generateStaticParams() {
  return categoryOrder.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!isCategory(slug)) {
    return { title: "קטגוריה" };
  }
  return { title: categoryLabelsHe[slug] };
}

export default async function CategoryPage({
  params,
}: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  if (!isCategory(slug)) {
    notFound();
  }

  return (
    <>
      <PageHero title={categoryLabelsHe[slug]} />
      <DealGrid deals={getDealsByCategory(slug)} />
    </>
  );
}
