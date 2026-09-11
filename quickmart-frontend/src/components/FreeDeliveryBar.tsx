"use client";

import { Truck } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPKR } from "@/lib/format";

export function FreeDeliveryBar() {
  const remaining = useCartStore((s) => s.freeDeliveryRemaining());
  const progress = useCartStore((s) => s.freeDeliveryProgress());

  const isFree = remaining === 0;

  return (
    <div className="rounded-xl border border-brand/20 bg-brand-light px-3 py-2.5">
      <div className="flex items-center gap-2 text-xs font-medium text-ink">
        <Truck size={14} className="shrink-0 text-brand" />
        {isFree ? (
          <span>You've unlocked free delivery 🎉</span>
        ) : (
          <span>
            Add <span className="font-bold text-brand-dark">{formatPKR(remaining)}</span> more
            for free delivery
          </span>
        )}
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white">
        <div
          className="h-full rounded-full bg-brand transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
