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
  const image = deal.image || undefined;
  return {
    title: deal.titleHe,
    description: deal.summaryHe,
    alternates: { canonical: `/deal/${deal.slug}` },
    openGraph: {
      type: "website",
      title: deal.titleHe,
      description: deal.summaryHe,
      url: `/deal/${deal.slug}`,
      images: image ? [{ url: image, alt: deal.imageAltHe }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: deal.titleHe,
      description: deal.summaryHe,
      images: image ? [image] : undefined,
    },
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
