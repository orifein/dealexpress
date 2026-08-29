export type DealCategory =
  | "shoes"
  | "toys"
  | "personal-care"
  | "storage"
  | "gaming"
  | "home"
  | "accessories";

export type Deal = {
  slug: string;
  demo: boolean;
  titleHe: string;
  titleEn: string;
  brand: string;
  category: DealCategory;
  color?: string;
  size?: string;
  model?: string;
  image: string;
  imageAltHe: string;
  storeUrl: string;
  storeName: string;
  priceUsd?: number;
  listPriceUsd?: number;
  landedIls?: number;
  compareIls?: number;
  shippingNoteHe?: string;
  summaryHe: string;
  highlightsHe: string[];
  publishedAt: string;
  featured?: boolean;
};
