import { redirect } from "next/navigation";
import { getAllDeals } from "@/lib/deals";

export function generateStaticParams() {
  return getAllDeals().map((deal) => ({ slug: deal.slug }));
}

export default async function LegacyDealPage({
  params,
}: PageProps<"/deals/[slug]">) {
  const { slug } = await params;
  redirect(`/deal/${slug}`);
}
