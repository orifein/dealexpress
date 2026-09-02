import type { Deal } from "@/types/deal";

export const STORE_FILTERS = [
  { slug: "all", label: "הכל" },
  { slug: "amazon", label: "אמזון" },
  { slug: "aliexpress", label: "AliExpress" },
  { slug: "iherb", label: "iHerb" },
] as const;

export type StoreFilterSlug = (typeof STORE_FILTERS)[number]["slug"];

function storeHaystack(deal: Deal): string {
  return [deal.store, deal.storeName, deal.storeUrl, deal.affiliateUrl]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function parseStoreFilter(value?: string | string[]): StoreFilterSlug {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === "amazon" || raw === "aliexpress" || raw === "iherb") {
    return raw;
  }
  return "all";
}

export function dealMatchesStore(deal: Deal, slug: StoreFilterSlug): boolean {
  if (slug === "all") {
    return true;
  }

  const hay = storeHaystack(deal);
  if (slug === "amazon") {
    return hay.includes("amazon");
  }
  if (slug === "aliexpress") {
    return hay.includes("aliexpress");
  }
  if (slug === "iherb") {
    return hay.includes("iherb");
  }
  return false;
}

export function filterDealsByStore(deals: Deal[], slug: StoreFilterSlug): Deal[] {
  return deals.filter((deal) => dealMatchesStore(deal, slug));
}

export function storeHref(basePath: string, slug: StoreFilterSlug): string {
  if (slug === "all") {
    return basePath;
  }
  const sep = basePath.includes("?") ? "&" : "?";
  return `${basePath}${sep}store=${slug}`;
}
