import type { DealCategory } from "@/types/deal";

export const categoryLabelsHe: Record<DealCategory, string> = {
  shoes: "הנעלה",
  toys: "צעצועים",
  "personal-care": "טיפוח",
  storage: "אחסון",
  gaming: "גיימינג",
  home: "בית",
  accessories: "אקססוריז",
};

export const categoryOrder: DealCategory[] = [
  "shoes",
  "toys",
  "personal-care",
  "storage",
  "gaming",
  "home",
  "accessories",
];
