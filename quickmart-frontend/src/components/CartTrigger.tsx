"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { formatPKR } from "@/lib/format";

export function CartTrigger() {
  const itemCount = useCartStore((s) => s.itemCount());
  const totalAmount = useCartStore((s) => s.totalAmount());
  const openCart = useUIStore((s) => s.openCart);

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.button
          key="cart-trigger"
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          onClick={openCart}
          className="fixed bottom-5 right-5 z-30 flex items-center gap-3 rounded-full bg-ink px-5 py-3.5 text-white shadow-lg shadow-ink/30 active:scale-95"
        >
          <span className="relative">
            <ShoppingCart size={20} />
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-chili text-[10px] font-bold">
              {itemCount}
            </span>
          </span>
          <span className="h-4 w-px bg-white/20" />
          <span className="text-sm font-semibold">{formatPKR(totalAmount)}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
