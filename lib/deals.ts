import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Deal, DealCategory } from "@/types/deal";

const dealsDir = join(process.cwd(), "content/deals");

function readDealFile(filename: string): Deal {
  const raw = readFileSync(join(dealsDir, filename), "utf8");
  return JSON.parse(raw) as Deal;
}

export function getAllDeals(): Deal[] {
  const files = readdirSync(dealsDir).filter((name) => name.endsWith(".json"));
  return files
    .map(readDealFile)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getRealDeals(): Deal[] {
  return getAllDeals().filter((deal) => !deal.demo);
}

export function getDemoDeals(): Deal[] {
  return getAllDeals().filter((deal) => deal.demo);
}

export function getDealBySlug(slug: string): Deal | undefined {
  return getAllDeals().find((deal) => deal.slug === slug);
}

export function getDealsByCategory(category: DealCategory): Deal[] {
  return getAllDeals().filter((deal) => deal.category === category);
}

export function getFeaturedDeals(): Deal[] {
  const featured = getRealDeals().filter((deal) => deal.featured);
  return featured.length > 0 ? featured : getRealDeals();
}

export function getRelatedDeals(deal: Deal, limit = 3): Deal[] {
  return getAllDeals()
    .filter((item) => item.slug !== deal.slug && item.category === deal.category)
    .slice(0, limit);
}
