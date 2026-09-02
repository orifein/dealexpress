import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { FollowSocials } from "@/components/FollowSocials";
import { SkipLink } from "@/components/SkipLink";
import { categoryLabel, categoryOrder } from "@/lib/categories";

const pages = [
  { href: "/deals", label: "כל הדילים" },
  { href: "/about", label: "על האתר" },
  { href: "/faq", label: "שאלות" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-card">
      <SkipLink />
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" aria-label="DEAL EXPRESS דף הבית">
            <BrandMark />
          </Link>
          <nav aria-label="ראשי" className="flex flex-wrap items-center gap-4 text-sm font-medium">
            {pages.map((page) => (
              <Link key={page.href} href={page.href} className="hover:text-brand">
                {page.label}
              </Link>
            ))}
            <FollowSocials variant="button" />
          </nav>
        </div>
        <nav aria-label="קטגוריות" className="flex flex-wrap gap-2">
          {categoryOrder.map((slug) => (
            <Link
              key={slug}
              href={`/category/${slug}`}
              className="rounded-full border border-line bg-paper px-3 py-1 text-sm hover:border-brand hover:text-brand"
            >
              {categoryLabel(slug)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
