import type { Metadata } from "next";
import { FollowFacebook } from "@/components/FollowFacebook";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "על האתר",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl space-y-6 text-lg leading-8">
      <PageHero title={`על ${site.brandEn}`} subtitle={site.brandHe} />
      <p>{site.descriptionHe}</p>
      <p>
        העורך הוא {site.ownerNameHe}, {site.ownerRoleHe}. הוא בוחר את הדילים,
        כותב את העברית, ומחשב מחיר נחת בשקלים כשאפשר.
      </p>
      <p>
        כשיש שדה <span dir="ltr">landedIls</span> — זה המחיר הראשי על הכרטיס.
        מחיר הדולר בחנות נשאר משני, כדי שתראו קודם כמה זה באמת עולה עד הבית.
      </p>
      <p>{site.affiliatePolicyHe}</p>
      <FollowFacebook />
    </div>
  );
}
