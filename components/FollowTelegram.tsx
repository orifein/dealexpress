import { hasTelegram, site } from "@/lib/site";

export function FollowTelegram({ variant = "bar" }: { variant?: "bar" | "button" }) {
  if (!hasTelegram()) {
    return null;
  }

  const className =
    variant === "button"
      ? "inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
      : "inline-flex items-center justify-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark";

  return (
    <a
      href={site.telegramUrl}
      className={className}
      rel="noopener noreferrer"
      target="_blank"
    >
      {variant === "button" ? "טלגרם" : "עקבו בטלגרם"}
    </a>
  );
}
