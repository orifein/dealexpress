import { site } from "@/lib/site";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand-mark.svg" alt="" width={compact ? 32 : 40} height={compact ? 32 : 40} />
      <span className="leading-tight">
        <span className="block font-bold tracking-[0.14em] text-brand">
          {site.brandEn}
        </span>
        {!compact ? (
          <span className="block text-sm text-muted">{site.brandHe}</span>
        ) : null}
      </span>
    </span>
  );
}
