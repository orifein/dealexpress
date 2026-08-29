import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DealDetail } from "@/components/DealDetail";
import { getAllDeals, getDealBySlug } from "@/lib/deals";

export function generateStaticParams() {
  return getAllDeals().map((deal) => ({ slug: deal.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/deal/[slug]">): Promise<Metadata> {
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

export default async function DealPage({ params }: PageProps<"/deal/[slug]">) {
  const { slug } = await params;
  const deal = getDealBySlug(slug);
  if (!deal) {
    notFound();
  }

  return <DealDetail deal={deal} />;
}
