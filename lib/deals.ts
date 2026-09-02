import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { categoriesMatch } from "@/lib/categories";
import type { Deal, DealCategory, OriginalPrice } from "@/types/deal";

const dealsDir = join(process.cwd(), "content/deals");

/** Demo JSON may stay on disk; listings and routes hide it by default. */
export const HIDE_DEMO_DEALS = true;

type DealFile = Partial<Deal> & {
  slug: string;
  image: string;
  publishedAt: string;
  title?: string;
  store?: string;
  affiliateUrl?: string;
  originalPrice?: OriginalPrice;
  badges?: string[];
  specs?: string[];
  warnings?: string[];
};

function inferBrand(title: string): string {
  const token = title.split(/\s+/).find((part) => /^[A-Za-z]/.test(part));
  return token ?? "DEAL EXPRESS";
}

function normalizeDeal(raw: DealFile): Deal {
  const title = raw.titleHe ?? raw.title ?? raw.slug;
  const storeUrl = raw.storeUrl ?? raw.affiliateUrl ?? "";
  const storeName = raw.storeName ?? raw.store ?? "";
  const badges = raw.badges ?? [];

  return {
    slug: raw.slug,
    demo: Boolean(raw.demo),
    title,
    titleHe: title,
    titleEn: raw.titleEn ?? title,
    brand: raw.brand ?? inferBrand(title),
    category: raw.category ?? "home",
    color: raw.color,
    size: raw.size,
    model: raw.model,
    image: raw.image,
    imageAltHe: raw.imageAltHe ?? title,
    store: raw.store ?? storeName,
    storeUrl,
    storeName,
    affiliateUrl: raw.affiliateUrl ?? storeUrl,
    originalPrice: raw.originalPrice,
    priceUsd: raw.priceUsd ?? raw.originalPrice?.amount,
    listPriceUsd: raw.listPriceUsd,
    landedIls: raw.landedIls,
    landedIlsEstimated: raw.landedIlsEstimated,
    couponCode: raw.couponCode ?? null,
    badges,
    expiresAt: raw.expiresAt ?? null,
    compareIls: raw.compareIls,
    shippingNoteHe: raw.shippingNoteHe,
    summaryHe: raw.summaryHe ?? title,
    highlightsHe: raw.highlightsHe?.length ? raw.highlightsHe : badges,
    specs: raw.specs,
    warnings: raw.warnings,
    publishedAt: raw.publishedAt,
    featured: raw.featured,
  };
}

function readDealFile(filename: string): Deal {
  const raw = JSON.parse(readFileSync(join(dealsDir, filename), "utf8")) as DealFile;
  return normalizeDeal(raw);
}

function readAllDealFiles(): Deal[] {
  const files = readdirSync(dealsDir).filter((name) => name.endsWith(".json"));
  return files
    .map(readDealFile)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getAllDeals(): Deal[] {
  const deals = readAllDealFiles();
  return HIDE_DEMO_DEALS ? deals.filter((deal) => !deal.demo) : deals;
}

export function getRealDeals(): Deal[] {
  return readAllDealFiles().filter((deal) => !deal.demo);
}

export function getDealBySlug(slug: string): Deal | undefined {
  return getAllDeals().find((deal) => deal.slug === slug);
}

export function getDealsByCategory(category: DealCategory | string): Deal[] {
  return getAllDeals().filter((deal) => categoriesMatch(deal.category, category));
}

export function getFeaturedDeals(): Deal[] {
  const featured = getRealDeals().filter((deal) => deal.featured);
  return featured.length > 0 ? featured : getRealDeals();
}

export function getRelatedDeals(deal: Deal, limit = 3): Deal[] {
  return getAllDeals()
    .filter((item) => item.slug !== deal.slug && categoriesMatch(item.category, deal.category))
    .slice(0, limit);
}
