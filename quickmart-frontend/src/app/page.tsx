import { CategoryNav } from "@/components/CategoryNav";
import { ProductGrid } from "@/components/ProductGrid";
import { CartTrigger } from "@/components/CartTrigger";
import { CartDrawer } from "@/components/CartDrawer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-paper pb-24">
      <header className="border-b border-ink/10 bg-white px-4 py-4">
        <h1 className="text-lg font-extrabold text-ink">
          Quick<span className="text-brand">mart</span>
        </h1>
        <p className="text-xs text-ink/50">Groceries delivered to your door in minutes</p>
      </header>

      <CategoryNav />
      <ProductGrid />

      <CartTrigger />
      <CartDrawer />
    </main>
  );
}
