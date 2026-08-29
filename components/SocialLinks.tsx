import { hasTelegram, hasWhatsApp, site } from "@/lib/site";

export function SocialLinks() {
  const telegram = hasTelegram();
  const whatsapp = hasWhatsApp();

  if (!telegram && !whatsapp) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {telegram ? (
        <a href={site.telegramUrl} className="underline" rel="noopener noreferrer" target="_blank">
          טלגרם
        </a>
      ) : null}
      {whatsapp ? (
        <a href={site.whatsappUrl} className="underline" rel="noopener noreferrer" target="_blank">
          וואטסאפ
        </a>
      ) : null}
    </div>
  );
}
