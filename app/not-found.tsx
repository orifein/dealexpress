import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-4 py-16 text-center">
      <h1 className="text-3xl font-extrabold text-navy">העמוד לא נמצא</h1>
      <p className="text-muted">יכול להיות שהדיל ירד או שהקישור ישן.</p>
      <Link href="/" className="inline-block font-semibold text-navy underline decoration-gold">
        חזרה לדף הבית
      </Link>
    </div>
  );
}
