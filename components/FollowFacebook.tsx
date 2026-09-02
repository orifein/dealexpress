import { hasFacebookFollow, site } from "@/lib/site";

function withUtm(url: string, content: string): string {
  try {
    const withParams = new URL(url);
    withParams.searchParams.set("utm_source", "dealexpress_site");
    withParams.searchParams.set("utm_medium", "website");
    withParams.searchParams.set("utm_campaign", "group_follow");
    withParams.searchParams.set("utm_content", content);
    return withParams.toString();
  } catch {
    return url;
  }
}

export function FollowFacebook({ variant = "bar" }: { variant?: "bar" | "button" }) {
  if (!hasFacebookFollow()) {
    return null;
  }

  const className =
    variant === "button"
      ? "inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
      : "inline-flex items-center justify-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark";

  return (
    <a
      href={withUtm(site.facebookFollowUrl, variant)}
      className={className}
      rel="noopener noreferrer"
      target="_blank"
    >
      עקבו אחרינו בפייסבוק
    </a>
  );
}
