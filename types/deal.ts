export type DealCategory =
  | "shoes"
  | "toys"
  | "personal-care"
  | "storage"
  | "gaming"
  | "kitchen-accessories"
  | "home-appliances"
  | "sport-watch"
  | "accessories"
  | "fashion"
  | "אביזרי מטבח"
  | "מכשירי חשמל לבית"
  | "ספורט / שעון חכם"
  | "צעצועים"
  | "גיימינג"
  | "לגו"
  | "music"
  | "מוזיקה"
  | "אוזניות"
  | "סוללות"
  | "לרכב"
  | "תוספי תזונה"
  | "pets"
  | "חיות מחמד";

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
  freeShippingOver49?: boolean;
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
