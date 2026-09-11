import { create } from "zustand";

interface UIState {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  activeCategory: string;
  activeSubCategory: string; // "" means "All" within the active category
  setActiveCategory: (categoryId: string) => void;
  setActiveSubCategory: (subCategoryId: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  activeCategory: "dairy-eggs",
  activeSubCategory: "",
  setActiveCategory: (categoryId) => set({ activeCategory: categoryId, activeSubCategory: "" }),
  setActiveSubCategory: (subCategoryId) => set({ activeSubCategory: subCategoryId }),
}));
