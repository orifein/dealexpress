import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "תנאי שימוש",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl space-y-4 text-lg leading-8">
      <PageHero title="תנאי שימוש" />
      <p>
        המחירים הם הערכה למועד הפרסום. מלאי, שער ומסים משתנים. בדקו בחנות לפני
        הזמנה.
      </p>
      <p>{site.usdIlsNoteHe}</p>
      <p>{site.affiliatePolicyHe}</p>
    </div>
  );
}
