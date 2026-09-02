import Link from "next/link";
import { STORE_FILTERS, storeHref, type StoreFilterSlug } from "@/lib/stores";

export function StoreFilters({
  active,
  basePath = "/",
}: {
  active: StoreFilterSlug;
  basePath?: string;
}) {
  return (
    <nav aria-label="סינון לפי חנות" className="mb-6 flex flex-wrap gap-2">
      {STORE_FILTERS.map((filter) => {
        const selected = filter.slug === active;
        return (
          <Link
            key={filter.slug}
            href={storeHref(basePath, filter.slug)}
            scroll={false}
            className={
              selected
                ? "rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-dark"
                : "rounded-full border border-line bg-card px-4 py-1.5 text-sm font-semibold text-navy hover:border-brand hover:text-brand"
            }
            aria-current={selected ? "page" : undefined}
          >
            {filter.label}
          </Link>
        );
      })}
    </nav>
  );
}
