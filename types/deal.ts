export type DealCategory =
  | "shoes"
  | "toys"
  | "personal-care"
  | "storage"
  | "gaming"
  | "home"
  | "home-kitchen"
  | "sport-watch"
  | "accessories"
  | "בית / מטבח"
  | "ספורט / שעון חכם";

export type OriginalPrice = {
  amount: number;
  currency: string;
};

export type Deal = {
  slug: string;
  demo: boolean;
  title: string;
  titleHe: string;
  titleEn: string;
  brand: string;
  category: DealCategory | string;
  color?: string;
  size?: string;
  model?: string;
  image: string;
  imageAltHe: string;
  store?: string;
  storeUrl: string;
  storeName: string;
  affiliateUrl?: string;
  originalPrice?: OriginalPrice;
  priceUsd?: number;
  listPriceUsd?: number;
  landedIls?: number;
  landedIlsEstimated?: boolean;
  couponCode?: string | null;
  badges?: string[];
  expiresAt?: string | null;
  compareIls?: number;
  shippingNoteHe?: string;
  summaryHe: string;
  highlightsHe: string[];
  publishedAt: string;
  featured?: boolean;
};
