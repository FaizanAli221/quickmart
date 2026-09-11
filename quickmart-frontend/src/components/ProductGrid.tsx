"use client";

import { useEffect, useState } from "react";
import { CATEGORIES } from "@/data/categories";
import { useUIStore } from "@/store/uiStore";
import { ProductCard } from "@/components/ProductCard";
import { fetchProducts } from "@/lib/api";
import type { Product } from "@/types";
import { Loader2, Server } from "lucide-react";

export function ProductGrid() {
  const activeCategory = useUIStore((s) => s.activeCategory);
  const activeSubCategory = useUIStore((s) => s.activeSubCategory);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);

  const category = CATEGORIES.find((c) => c.id === activeCategory);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchProducts(activeCategory, activeSubCategory)
      .then((res) => {
        if (isMounted) {
          setProducts(res.products);
          setIsLive(res.isLive);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeCategory, activeSubCategory]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-4 py-20 text-center text-ink/60">
        <Loader2 className="h-7 w-7 animate-spin text-brand" />
        <p className="text-xs font-semibold">Loading items from backend...</p>
      </div>
    );
  }

  if (products.length === 0) {
    const subLabel = category?.subCategories.find((s) => s.id === activeSubCategory)?.label;
    return (
      <div className="flex flex-col items-center justify-center gap-1 px-4 py-16 text-center">
        <p className="text-sm font-semibold text-ink">
          No products in {subLabel ?? category?.label} yet
        </p>
        <p className="text-xs text-ink/50">Check back soon — we restock every day.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      {/* Backend connection indicator header */}
      <div className="mb-3 flex items-center justify-between text-xs text-ink/50">
        <span>Showing {products.length} products</span>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 border border-emerald-200">
          <span className="relative flex h-2 w-2">
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${isLive ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
            <span className={`relative inline-flex h-2 w-2 rounded-full ${isLive ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </span>
          <Server className="h-3 w-3" />
          <span>{isLive ? "Backend API Live" : "Fallback Mode"}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
