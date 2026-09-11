"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import type { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { formatPKR } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const quantityInCart = useCartStore((s) => s.quantityInCart(product.id));
  const availableStock = useCartStore((s) => s.availableStock(product));
  const addItem = useCartStore((s) => s.addItem);
  const incrementItem = useCartStore((s) => s.incrementItem);
  const decrementItem = useCartStore((s) => s.decrementItem);

  const isOutOfStock = product.stock === 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm shadow-ink/5 transition-shadow duration-150 hover:shadow-md hover:shadow-ink/10">
      <div className="relative aspect-square w-full overflow-hidden bg-paper">
        <img
          src={product.image}
          alt={product.name}
          className={`h-full w-full object-cover transition-transform duration-200 ${
            isOutOfStock ? "opacity-50 grayscale" : "group-hover:scale-105"
          }`}
          loading="lazy"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/40">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="text-xs font-medium text-ink/50">{product.unit}</span>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink">
          {product.name}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-sm font-bold text-ink">{formatPKR(product.price)}</span>

          <AnimatePresence mode="wait" initial={false}>
            {quantityInCart === 0 ? (
              <motion.button
                key="add"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.15 }}
                disabled={isOutOfStock}
                onClick={() => addItem(product)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-150 ${
                  isOutOfStock
                    ? "cursor-not-allowed bg-ink/10 text-ink/30"
                    : "bg-brand text-white hover:bg-brand-dark active:scale-95"
                }`}
              >
                + Add
              </motion.button>
            ) : (
              <motion.div
                key="stepper"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2 rounded-full bg-brand px-1 py-1"
              >
                <button
                  aria-label={`Decrease quantity of ${product.name}`}
                  onClick={() => decrementItem(product.id)}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-brand transition-transform active:scale-90"
                >
                  <Minus size={14} strokeWidth={2.5} />
                </button>
                <span className="w-4 text-center text-xs font-bold text-white">
                  {quantityInCart}
                </span>
                <button
                  aria-label={`Increase quantity of ${product.name}`}
                  onClick={() => incrementItem(product.id)}
                  disabled={availableStock === 0}
                  className={`flex h-6 w-6 items-center justify-center rounded-full transition-transform active:scale-90 ${
                    availableStock === 0
                      ? "cursor-not-allowed bg-white/40 text-white/60"
                      : "bg-white text-brand"
                  }`}
                >
                  <Plus size={14} strokeWidth={2.5} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {quantityInCart > 0 && availableStock === 0 && (
          <span className="text-[11px] font-medium text-chili">Max stock reached</span>
        )}
      </div>
    </div>
  );
}
