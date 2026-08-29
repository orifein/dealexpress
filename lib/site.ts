import siteJson from "@/content/site.json";
import type { SiteConfig } from "@/types/site";

export const site: SiteConfig = siteJson;

export function hasFacebookFollow(): boolean {
  return Boolean(site.facebookFollowUrl);
}

export function hasTelegram(): boolean {
  return Boolean(site.telegramUrl);
}

export function hasWhatsApp(): boolean {
  return Boolean(site.whatsappUrl);
}
