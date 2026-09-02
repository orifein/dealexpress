import { hasWhatsApp, site } from "@/lib/site";

/** WhatsApp only. Telegram is the FollowTelegram pill next to Facebook. */
export function SocialLinks() {
  if (!hasWhatsApp()) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3">
      <a href={site.whatsappUrl} className="underline" rel="noopener noreferrer" target="_blank">
        וואטסאפ
      </a>
    </div>
  );
}
