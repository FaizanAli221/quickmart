# Quickmart — Quick-Commerce Grocery Frontend

A portfolio-ready frontend for a hyper-local grocery delivery platform
(Pandamart / Cheetay-style), built with Next.js App Router, TypeScript,
Tailwind CSS, Zustand, and Framer Motion.

## Setup

```bash
npm install
npm run dev
```

Requires Node 18+. Open http://localhost:3000.

## Project structure

```
src/
  types/index.ts           Product, CartItem, Category types
  data/products.ts         12 mock Pakistani grocery products (PKR pricing, stock)
  data/categories.ts       Category → sub-category taxonomy
  store/cartStore.ts       Zustand store: cart items, derived available stock, totals
  store/uiStore.ts         Zustand store: drawer open state, active category/sub-category
  lib/format.ts            PKR currency formatting
  lib/useIsMobile.ts       Viewport hook used to switch the drawer's slide direction
  components/
    CategoryNav.tsx        Sticky horizontal pill bar + sub-category tabs
    ProductGrid.tsx        Filtered product grid + empty-category state
    ProductCard.tsx        Product card with Add → stepper micro-interaction
    CartTrigger.tsx        Floating bottom-right cart button
    CartDrawer.tsx         Slide-over cart (right on desktop, bottom sheet on mobile)
    FreeDeliveryBar.tsx    Progress bar toward the free-delivery threshold
  app/page.tsx              Page composition
  app/layout.tsx             Root layout, font loading
  app/globals.css            Tailwind entrypoint
```

## How stock control works

`availableStock(product)` in `cartStore.ts` is **derived**, not duplicated
state: it's always `product.stock - quantityAlreadyInCart`. That means
there's no separate "remaining stock" value that can drift out of sync —
decrementing or removing a cart item automatically frees up stock again.
The `+` button (on both the product card and inside the drawer) is disabled
the instant `quantity === maxStock`.

## Business rules baked into the store

- Free delivery over **Rs. 1,500** subtotal, otherwise a flat **Rs. 99** fee
  (see `FREE_DELIVERY_THRESHOLD` / `FLAT_DELIVERY_FEE` in `cartStore.ts`).
- `Nurpur Cheese Slices 200g` ships with `stock: 0` in the mock dataset so
  you can see the out-of-stock badge and disabled "+ Add" button without
  needing to empty a product's stock manually.

## Notes for integrating into a real project

- Product images use placeholder URLs (`placehold.co`) — swap `data/products.ts`
  with real image URLs from your asset pipeline.
- "Proceed to Checkout" is wired for styling only — hook it up to your
  checkout route/flow.
- Tailwind tokens (brand green / chili orange / mango yellow) live in
  `tailwind.config.ts` — adjust to match your actual brand.
