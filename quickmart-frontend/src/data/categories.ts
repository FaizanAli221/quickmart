import type { Category } from "@/types";

export const CATEGORIES: Category[] = [
  {
    id: "dairy-eggs",
    label: "Dairy & Eggs",
    subCategories: [
      { id: "milk", label: "Milk" },
      { id: "butter-cheese", label: "Butter & Cheese" },
      { id: "yogurt", label: "Yogurt" },
      { id: "eggs", label: "Eggs" },
    ],
  },
  {
    id: "snacks-munchies",
    label: "Snacks & Munchies",
    subCategories: [
      { id: "chips", label: "Chips" },
      { id: "biscuits", label: "Biscuits" },
      { id: "namkeen", label: "Namkeen" },
    ],
  },
  {
    id: "beverages",
    label: "Beverages",
    subCategories: [
      { id: "tea-coffee", label: "Tea & Coffee" },
      { id: "juices", label: "Juices" },
      { id: "soft-drinks", label: "Soft Drinks" },
    ],
  },
  {
    id: "fruits-vegetables",
    label: "Fruits & Vegetables",
    subCategories: [
      { id: "fresh-fruits", label: "Fresh Fruits" },
      { id: "fresh-vegetables", label: "Fresh Vegetables" },
    ],
  },
  {
    id: "pantry",
    label: "Pantry",
    subCategories: [
      { id: "cooking-oil", label: "Cooking Oil" },
      { id: "rice-atta", label: "Rice & Atta" },
      { id: "spices", label: "Spices" },
      { id: "sauces-spreads", label: "Sauces & Spreads" },
    ],
  },
];
