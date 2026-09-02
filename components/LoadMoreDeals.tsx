"use client";

import { useState } from "react";
import { DealGrid } from "@/components/DealGrid";
import type { Deal } from "@/types/deal";

export function LoadMoreDeals({
  deals,
  initialCount,
  empty,
}: {
  deals: Deal[];
  initialCount: number;
  empty?: string;
}) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const visibleDeals = deals.slice(0, visibleCount);
  const hasMore = deals.length > visibleCount;

  return (
    <>
      <DealGrid deals={visibleDeals} empty={empty} />
      {hasMore ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + initialCount)}
            className="rounded-full bg-navy px-8 py-3 text-sm font-bold text-white transition hover:bg-navy/90"
          >
            הצגת עוד דילים ({deals.length - visibleCount} נוספים)
          </button>
        </div>
      ) : null}
    </>
  );
}
