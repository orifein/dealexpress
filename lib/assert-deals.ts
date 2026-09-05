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
  "lego-76449-monster-book",
  "yamaha-pss-f30-black",
  "lego-10311-orchid",
  "lenovo-gm2-pro",
  "baseus-22-5w-20000",
  "cmf-buds-pro-2",
  "70mai-m310-plus",
  "70mai-a810s",
  "doctors-best-mag-240",
  "cgn-omega-3-100",
  "now-d3-k2-120",
  "cgn-d3-5000-90",
  "cgn-gold-c-1000-60",
  "aeropress-go",
  "hario-v60-buono-1-2l",
  "subminimal-nanofoamer-v2",
] as const;

export function missingRealDeals(): string[] {
  const have = new Set(getRealDeals().map((deal) => deal.slug));
  return requiredRealSlugs.filter((slug) => !have.has(slug));
}
