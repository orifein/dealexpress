import Link from "next/link";
import { FollowSocials } from "@/components/FollowSocials";
import { SocialLinks } from "@/components/SocialLinks";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-navy text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:justify-between">
        <div className="max-w-md space-y-3">
          <p className="font-bold tracking-[0.14em]">{site.brandEn}</p>
          <p>{site.descriptionHe}</p>
          <p className="text-sm text-white/80">{site.affiliatePolicyHe}</p>
        </div>
        <div className="space-y-3 text-sm">
          <FollowSocials />
          <SocialLinks />
          <div className="flex flex-col gap-2">
            <Link href="/privacy" className="underline decoration-brand/50">
              מדיניות פרטיות
            </Link>
            <Link href="/terms" className="underline decoration-brand/50">
              תנאי שימוש
            </Link>
            <Link href="/about" className="underline decoration-brand/50">
              על האתר
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
