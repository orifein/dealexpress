import type { Deal } from "@/types/deal";

export function hasLandedPrice(deal: Deal): boolean {
  return typeof deal.landedIls === "number" && deal.landedIls > 0;
}

export function primaryPriceLabel(deal: Deal): {
  kind: "landed" | "usd" | "none";
  labelHe: string;
  value?: string;
} {
  if (hasLandedPrice(deal) && deal.landedIls != null) {
    return { kind: "landed", labelHe: "מחיר סופי", value: String(deal.landedIls) };
  }
  if (typeof deal.priceUsd === "number") {
    return { kind: "usd", labelHe: "מחיר בחנות", value: String(deal.priceUsd) };
  }
  return { kind: "none", labelHe: "מחיר בהמשך" };
}

export function savingsIls(deal: Deal): number | null {
  if (
    typeof deal.landedIls === "number" &&
    typeof deal.compareIls === "number" &&
    deal.compareIls > deal.landedIls
  ) {
    return deal.compareIls - deal.landedIls;
  }
  return null;
}
