import type { DealCategory } from "@/types/deal";

export const categoryLabelsHe: Record<string, string> = {
  shoes: "הנעלה",
  toys: "צעצועים",
  "personal-care": "טיפוח",
  storage: "אחסון",
  gaming: "גיימינג",
  "kitchen-accessories": "אביזרי מטבח",
  "home-appliances": "מכשירי חשמל לבית",
  "sport-watch": "ספורט / שעון חכם",
  accessories: "אקססוריז",
  fashion: "אופנה",
  "אביזרי מטבח": "אביזרי מטבח",
  "מכשירי חשמל לבית": "מכשירי חשמל לבית",
  "ספורט / שעון חכם": "ספורט / שעון חכם",
  "צעצועים": "צעצועים",
  "גיימינג": "גיימינג",
  "לגו": "לגו",
  music: "מוזיקה",
  "מוזיקה": "מוזיקה",
  "אוזניות": "אוזניות",
  "סוללות": "סוללות",
  "לרכב": "לרכב",
  "תוספי תזונה": "תוספי תזונה",
  pets: "חיות מחמד",
  "חיות מחמד": "חיות מחמד",
  coffee: "קפה",
  "קפה": "קפה",
};

export const categorySlugs: Record<string, string> = {
  shoes: "shoes",
  toys: "toys",
  "personal-care": "personal-care",
  storage: "storage",
  gaming: "gaming",
  accessories: "accessories",
  fashion: "fashion",
  "kitchen-accessories": "kitchen-accessories",
  "home-appliances": "home-appliances",
  "sport-watch": "sport-watch",
  "אביזרי מטבח": "kitchen-accessories",
  "מכשירי חשמל לבית": "home-appliances",
  "ספורט / שעון חכם": "sport-watch",
  "צעצועים": "toys",
  "גיימינג": "gaming",
  "לגו": "toys",
  music: "music",
  "מוזיקה": "music",
  "אוזניות": "headphones",
  "סוללות": "batteries",
  "לרכב": "car",
  "תוספי תזונה": "supplements",
  pets: "pets",
  "חיות מחמד": "pets",
  coffee: "coffee",
  "קפה": "coffee",
};

export const categoryOrder: DealCategory[] = [
  "shoes",
  "toys",
  "personal-care",
  "storage",
  "gaming",
  "kitchen-accessories",
  "home-appliances",
  "sport-watch",
  "accessories",
  "fashion",
  "music",
  "pets",
  "coffee",
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
