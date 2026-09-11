"use client";

import { CATEGORIES } from "@/data/categories";
import { useUIStore } from "@/store/uiStore";

export function CategoryNav() {
  const activeCategory = useUIStore((s) => s.activeCategory);
  const activeSubCategory = useUIStore((s) => s.activeSubCategory);
  const setActiveCategory = useUIStore((s) => s.setActiveCategory);
  const setActiveSubCategory = useUIStore((s) => s.setActiveSubCategory);

  const currentCategory = CATEGORIES.find((c) => c.id === activeCategory) ?? CATEGORIES[0];

  return (
    <div className="sticky top-0 z-20 bg-paper/95 backdrop-blur border-b border-ink/10">
      {/* Primary category pills */}
      <div
        className="flex gap-2 overflow-x-auto px-4 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Grocery categories"
      >
        {CATEGORIES.map((category) => {
          const isActive = category.id === activeCategory;
          return (
            <button
              key={category.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveCategory(category.id)}
              className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "border-brand bg-brand text-white shadow-sm shadow-brand/30"
                  : "border-ink/15 bg-white text-ink/70 hover:border-brand/40 hover:text-ink"
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      {/* Sub-category tabs for the selected category */}
      <div
        className="flex gap-4 overflow-x-auto px-4 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label={`${currentCategory.label} sub-categories`}
      >
        <button
          onClick={() => setActiveSubCategory("")}
          className={`shrink-0 whitespace-nowrap pb-1 text-sm font-medium border-b-2 transition-colors duration-150 ${
            activeSubCategory === ""
              ? "border-chili text-ink"
              : "border-transparent text-ink/50 hover:text-ink"
          }`}
        >
          All
        </button>
        {currentCategory.subCategories.map((sub) => (
          <button
            key={sub.id}
            onClick={() => setActiveSubCategory(sub.id)}
            className={`shrink-0 whitespace-nowrap pb-1 text-sm font-medium border-b-2 transition-colors duration-150 ${
              activeSubCategory === sub.id
                ? "border-chili text-ink"
                : "border-transparent text-ink/50 hover:text-ink"
            }`}
          >
            {sub.label}
          </button>
        ))}
      </div>
    </div>
  );
}
