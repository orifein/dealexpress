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
  | "ספורט / שעון חכם"
  | "צעצועים"
  | "גיימינג"
  | "לגו"
  | "music"
  | "מוזיקה"
  | "אוזניות"
  | "סוללות"
  | "לרכב";

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
  itemIls?: number;
  itemOnly?: boolean;
  itemId?: string;
  landedIlsEstimated?: boolean;
  couponCode?: string | null;
  badges?: string[];
  expiresAt?: string | null;
  compareIls?: number;
  shippingNoteHe?: string;
  shippingNote?: string;
  priceKind?: "item" | "landed";
  summaryHe: string;
  highlightsHe: string[];
  specs?: string[];
  warnings?: string[];
  publishedAt: string;
  featured?: boolean;
};
