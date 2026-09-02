import type { DealCategory } from "@/types/deal";

export const categoryLabelsHe: Record<string, string> = {
  shoes: "הנעלה",
  toys: "צעצועים",
  "personal-care": "טיפוח",
  storage: "אחסון",
  gaming: "גיימינג",
  home: "בית",
  "home-kitchen": "בית / מטבח",
  "sport-watch": "ספורט / שעון חכם",
  accessories: "אקססוריז",
  "בית / מטבח": "בית / מטבח",
  "ספורט / שעון חכם": "ספורט / שעון חכם",
  "צעצועים": "צעצועים",
  "גיימינג": "גיימינג",
  "לגו": "לגו",
};

export const categorySlugs: Record<string, string> = {
  shoes: "shoes",
  toys: "toys",
  "personal-care": "personal-care",
  storage: "storage",
  gaming: "gaming",
  home: "home",
  accessories: "accessories",
  "home-kitchen": "home-kitchen",
  "sport-watch": "sport-watch",
  "בית / מטבח": "home-kitchen",
  "ספורט / שעון חכם": "sport-watch",
  "צעצועים": "toys",
  "גיימינג": "gaming",
  "לגו": "toys",
};

export const categoryOrder: DealCategory[] = [
  "shoes",
  "toys",
  "personal-care",
  "storage",
  "gaming",
  "home",
  "home-kitchen",
  "sport-watch",
  "accessories",
];

export function categoryLabel(category: string): string {
  return categoryLabelsHe[category] ?? category;
}

export function categoryPath(category: string): string {
  return categorySlugs[category] ?? category;
}

export function categoriesMatch(a: string, b: string): boolean {
  return a === b || categoryPath(a) === categoryPath(b);
}
