import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "מדיניות פרטיות",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl space-y-4 text-lg leading-8">
      <PageHero title="מדיניות פרטיות" />
      <p>
        DEAL EXPRESS הוא אתר תוכן. אנחנו לא אוספים חשבונות משתמש ואין כאן קופה.
      </p>
      <p>
        קישורי חנות נפתחים באתר החיצוני. מדיניות הפרטיות של אותה חנות חלה שם.
      </p>
      <p>
        קבוצת הפייסבוק וערוץ הטלגרם הם ערוצי המעקב שמוצגים באתר. וואטסאפ לא פעיל.
      </p>
    </div>
  );
}
