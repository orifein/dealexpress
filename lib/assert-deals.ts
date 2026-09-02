import { getRealDeals } from "@/lib/deals";

export const requiredRealSlugs = [
  "reebok-shadoray-black-white-us9",
  "reebok-shadoray-white-green-us9",
  "lego-76444-diagon-alley",
  "philips-oneblade-5pk-qp450-50",
  "crucial-x9-4tb",
  "razer-basilisk-v3-pro-black",
  "oral-b-io-gentle-cleaning-white-10",
  "oral-b-io-gentle-cleaning-black-10",
  "brita-maxtra-pro-12",
  "garmin-vivoactive-6-pebble-grey",
  "lego-76451-privet-drive",
  "lego-76325-quinjet",
  "nba-2k27-ps5",
] as const;

export function missingRealDeals(): string[] {
  const have = new Set(getRealDeals().map((deal) => deal.slug));
  return requiredRealSlugs.filter((slug) => !have.has(slug));
}
