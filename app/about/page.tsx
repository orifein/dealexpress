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
      <PageHero title={`על ${site.brandEn}`} subtitle={site.taglineHe} />
      <p>{site.descriptionHe}</p>
      <p>
        כשיש מחיר סופי משוער בשקלים — הוא מוצג ראשון על הכרטיס, עם סימן ~ כי זו
        הערכה עד הבית.
      </p>
      <p>{site.affiliatePolicyHe}</p>
      <FollowFacebook />
    </div>
  );
}
