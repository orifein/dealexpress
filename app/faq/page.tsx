import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "שאלות נפוצות",
};

const faqs = [
  {
    q: "מה זה מחיר סופי?",
    a: "ההערכה שלנו לכמה תשלמו בשקלים אחרי מוצר, משלוח, מכס ומע״מ — כשאפשר לחשב. אם השדה קיים, הוא מוצג ראשון בכרטיס עם ~ כי זו הערכה.",
  },
  {
    q: "יש כאן קישורי שותפים?",
    a: "כן. חלק מהקישורים באתר הם קישורי שותפים (affiliate). רכישה דרכם מסייעת לתפעול האתר בלי תוספת מחיר עבורכם.",
  },
  {
    q: "איך עוקבים אחרי דילים חדשים?",
    a: "בקבוצת הפייסבוק של DEAL EXPRESS. טלגרם ווואטסאפ לא פעילים כרגע.",
  },
  {
    q: "מה מוצג על הכרטיס?",
    a: "מחיר סופי משוער בשקלים (~₪) וחיסכון מול מחיר בארץ כשיש השוואה. בלי מחיר דולר או יורו על הכרטיס או בעמוד הדיל.",
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHero title="שאלות נפוצות" />
      <dl className="max-w-3xl space-y-6">
        {faqs.map((item) => (
          <div key={item.q} className="rounded-2xl border border-line bg-card p-5">
            <dt className="text-xl font-bold text-navy">{item.q}</dt>
            <dd className="mt-2 text-lg leading-8">{item.a}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
