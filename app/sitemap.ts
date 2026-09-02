import type { MetadataRoute } from "next";
import { categoryOrder } from "@/lib/categories";
import { getAllDeals } from "@/lib/deals";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/deals", "/about", "/privacy", "/terms", "/faq"].map(
    (path) => ({
      url: `https://dealexpress-live.vercel.app${path}`,
      lastModified: new Date(),
    }),
  );

  const deals = getAllDeals().map((deal) => ({
    url: `https://dealexpress-live.vercel.app/deal/${deal.slug}`,
    lastModified: new Date(deal.publishedAt),
  }));

  const categories = categoryOrder.map((slug) => ({
    url: `https://dealexpress-live.vercel.app/category/${slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...deals, ...categories];
}
