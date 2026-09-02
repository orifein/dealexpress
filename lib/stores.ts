import type { Deal } from "@/types/deal";

export const STORE_FILTERS = [
  { slug: "all", label: "הכל" },
  { slug: "amazon", label: "אמזון" },
  { slug: "aliexpress", label: "AliExpress" },
  { slug: "iherb", label: "iHerb" },
] as const;

export type StoreFilterSlug = (typeof STORE_FILTERS)[number]["slug"];
export type StoreGroup = "amazon" | "aliexpress" | "iherb" | "other";

function storeHaystack(deal: Deal): string {
  return [deal.store, deal.storeName, deal.storeUrl, deal.affiliateUrl]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function storeLabelHaystack(deal: Deal): string {
  return [deal.store, deal.storeName].filter(Boolean).join(" ").toLowerCase();
}

export function parseStoreFilter(value?: string | string[]): StoreFilterSlug {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === "amazon" || raw === "aliexpress" || raw === "iherb") {
    return raw;
  }
  return "all";
}

export function storeGroup(deal: Deal): StoreGroup {
  const hay = storeHaystack(deal);
  const labels = ` ${storeLabelHaystack(deal)} `;

  if (hay.includes("amazon")) {
    return "amazon";
  }
  if (
    hay.includes("aliexpress") ||
    hay.includes("ali express") ||
    /(^|[\s,;|/])ae($|[\s,;|/])/.test(labels)
  ) {
    return "aliexpress";
  }
  if (hay.includes("iherb")) {
    return "iherb";
  }
  return "other";
}

/** Amazon cards/PDPs show vs-Israel compare. AliExpress and iHerb do not. */
export function showsIsraelCompare(deal: Deal): boolean {
  return storeGroup(deal) === "amazon";
}

export function isIsraelCompareCopy(text: string): boolean {
  return /בארץ|בזאפ|\bzap\b|מחיר בחנות/i.test(text);
}

export function dealMatchesStore(deal: Deal, slug: StoreFilterSlug): boolean {
  if (slug === "all") {
    return true;
  }
  return storeGroup(deal) === slug;
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
