import siteJson from "@/content/site.json";
import type { SiteConfig } from "@/types/site";

const FACEBOOK_GROUP_URL = "https://www.facebook.com/groups/dealexpress/";

export const site: SiteConfig = {
  ...siteJson,
  facebookFollowUrl:
    process.env.NEXT_PUBLIC_FACEBOOK_URL?.trim() ||
    siteJson.facebookFollowUrl ||
    FACEBOOK_GROUP_URL,
};

export function hasFacebookFollow(): boolean {
  return Boolean(site.facebookFollowUrl);
}

export function hasTelegram(): boolean {
  return Boolean(site.telegramUrl);
}

export function hasWhatsApp(): boolean {
  return Boolean(site.whatsappUrl);
}
