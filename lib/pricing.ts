import type { Deal } from "@/types/deal";
import { showsIsraelCompare } from "@/lib/stores";

export const DEFAULT_ITEM_SHIPPING_NOTE = "משלוח לישראל לפי הקופה";

export function resolvePriceKind(deal: Deal): "item" | "landed" {
  if (deal.priceKind === "item" || deal.itemOnly === true) {
    return "item";
  }
  if (deal.priceKind === "landed") {
    return "landed";
  }
  return "landed";
}

/** ₪ figure content sent for display. Never computed. Item deals use itemIls, not landed. */
export function displayIlsAmount(deal: Deal): number | undefined {
  if (resolvePriceKind(deal) === "item") {
    return typeof deal.itemIls === "number" && deal.itemIls > 0 ? deal.itemIls : undefined;
  }
  return typeof deal.landedIls === "number" && deal.landedIls > 0 ? deal.landedIls : undefined;
}

export function hasLandedPrice(deal: Deal): boolean {
  return typeof deal.landedIls === "number" && deal.landedIls > 0;
}

export function hasDisplayIls(deal: Deal): boolean {
  return displayIlsAmount(deal) != null;
}

export function displayShippingNote(deal: Deal): string | undefined {
  const note = deal.shippingNote ?? deal.shippingNoteHe;
  if (note) {
    return note;
  }
  if (resolvePriceKind(deal) === "item") {
    return DEFAULT_ITEM_SHIPPING_NOTE;
  }
  return undefined;
}

export function primaryPriceLabel(deal: Deal): {
  kind: "item" | "landed" | "none";
  labelHe: string;
  value?: string;
} {
  const amount = displayIlsAmount(deal);
  if (amount != null) {
    const kind = resolvePriceKind(deal);
    return {
      kind,
      labelHe: kind === "item" ? "מחיר" : "מחיר סופי",
      value: String(amount),
    };
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
