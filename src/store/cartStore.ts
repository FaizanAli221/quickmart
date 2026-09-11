import { create } from "zustand";
import type { CartItem, Product } from "@/types";

export const FREE_DELIVERY_THRESHOLD = 1500;
export const FLAT_DELIVERY_FEE = 99;

interface CartState {
  cartItems: CartItem[];

  // actions
  addItem: (product: Product) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;

  // stock helpers (derived, never duplicated in state -> can't drift out of sync)
  quantityInCart: (id: string) => number;
  availableStock: (product: Product) => number;

  // cart summary selectors
  subtotal: () => number;
  deliveryFee: () => number;
  totalAmount: () => number;
  itemCount: () => number;
  freeDeliveryRemaining: () => number;
  freeDeliveryProgress: () => number; // 0-100
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],

  addItem: (product) => {
    const { cartItems, availableStock } = get();
    if (availableStock(product) <= 0) return; // guard: nothing left to add

    const existing = cartItems.find((item) => item.id === product.id);
    if (existing) {
      set({
        cartItems: cartItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      });
    } else {
      set({
        cartItems: [
          ...cartItems,
          {
            id: product.id,
            name: product.name,
            unit: product.unit,
            price: product.price,
            quantity: 1,
            maxStock: product.stock,
            image: product.image,
          },
        ],
      });
    }
  },

  incrementItem: (id) => {
    const { cartItems } = get();
    const item = cartItems.find((i) => i.id === id);
    if (!item || item.quantity >= item.maxStock) return; // guard: hard stock ceiling
    set({
      cartItems: cartItems.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)),
    });
  },

  decrementItem: (id) => {
    const { cartItems } = get();
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;
    if (item.quantity <= 1) {
      set({ cartItems: cartItems.filter((i) => i.id !== id) });
    } else {
      set({
        cartItems: cartItems.map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i)),
      });
    }
  },

  removeItem: (id) => set({ cartItems: get().cartItems.filter((i) => i.id !== id) }),

  clearCart: () => set({ cartItems: [] }),

  quantityInCart: (id) => get().cartItems.find((i) => i.id === id)?.quantity ?? 0,

  // Stock remaining = catalog stock - whatever is already sitting in the cart.
  // This restores instantly on decrement/removal because it's derived, not stored.
  availableStock: (product) => Math.max(product.stock - get().quantityInCart(product.id), 0),

  subtotal: () => get().cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),

  deliveryFee: () => {
    const subtotal = get().subtotal();
    if (subtotal === 0) return 0;
    return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : FLAT_DELIVERY_FEE;
  },

  totalAmount: () => get().subtotal() + get().deliveryFee(),

  itemCount: () => get().cartItems.reduce((sum, item) => sum + item.quantity, 0),

  freeDeliveryRemaining: () => Math.max(FREE_DELIVERY_THRESHOLD - get().subtotal(), 0),

  freeDeliveryProgress: () => {
    const subtotal = get().subtotal();
    return Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100));
  },
}));
