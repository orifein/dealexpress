import type { Deal } from "@/types/deal";
import { showsIsraelCompare } from "@/lib/stores";

export function hasLandedPrice(deal: Deal): boolean {
  return typeof deal.landedIls === "number" && deal.landedIls > 0;
}

export function primaryPriceLabel(deal: Deal): {
  kind: "landed" | "none";
  labelHe: string;
  value?: string;
} {
  if (hasLandedPrice(deal) && deal.landedIls != null) {
    return { kind: "landed", labelHe: "מחיר סופי", value: String(deal.landedIls) };
  }
  return { kind: "none", labelHe: "מחיר בהמשך" };
}

export function savingsIls(deal: Deal): number | null {
  if (!showsIsraelCompare(deal)) {
    return null;
  }
  if (
    typeof deal.landedIls === "number" &&
    typeof deal.compareIls === "number" &&
    deal.compareIls > deal.landedIls
  ) {
    return deal.compareIls - deal.landedIls;
  }
  return null;
}
