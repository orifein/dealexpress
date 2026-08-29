import { hasFacebookFollow, site } from "@/lib/site";

export function FollowFacebook({ variant = "bar" }: { variant?: "bar" | "button" }) {
  if (!hasFacebookFollow()) {
    return null;
  }

  const className =
    variant === "button"
      ? "inline-flex items-center justify-center rounded-full bg-[#1877F2] px-4 py-2 text-sm font-semibold text-white"
      : "inline-flex items-center justify-center rounded-full bg-[#1877F2] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110";

  return (
    <a
      href={site.facebookFollowUrl}
      className={className}
      rel="noopener noreferrer"
      target="_blank"
    >
      עקבו אחרינו בפייסבוק
    </a>
  );
}
