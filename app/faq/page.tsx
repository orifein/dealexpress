import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "שאלות נפוצות",
};

const faqs = [
  {
    q: "מה זה מחיר נחת?",
    a: "ההערכה שלנו לכמה תשלמו בשקלים אחרי מוצר, משלוח, מכס ומע״מ — כשאפשר לחשב. אם השדה קיים, הוא מוצג ראשון בכרטיס.",
  },
  {
    q: "יש כאן קישורי שותפים?",
    a: "לא ממציאים מזהי שותפים. קישורי חנות יוצאים נקיים, בלי tag.",
  },
  {
    q: "איך עוקבים אחרי דילים חדשים?",
    a: "בקבוצת הפייסבוק של DEAL EXPRESS. טלגרם ווואטסאפ לא פעילים כרגע.",
  },
  {
    q: "מה ההבדל בין דיל אמיתי לדוגמה?",
    a: "דיל אמיתי מסומן demo:false בקבצי התוכן. דוגמאות תצוגה נושאות תג «דוגמה» ואין להן קישור קנייה.",
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
