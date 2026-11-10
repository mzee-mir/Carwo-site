import type { Metadata } from "next";
import { CategoryFilter } from "@/components/shop/CategoryFilter";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { SplitText } from "@/components/motion/SplitText";
import { getCategories, getProducts, getSettings } from "@/lib/sanity/data";

export const revalidate = 60;
export const metadata: Metadata = { title: "Shop | Carwo", description: "Tees, hoodies, bottoms and accessories from Carwo." };

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const [categories, settings] = await Promise.all([getCategories(), getSettings()]);
  const active = categories.some((c) => c.slug === category) ? category : undefined;
  const products = await getProducts(active ? { category: active } : {});
  return (
    <>
      <div className="flex items-end justify-between px-5 pt-10 pb-6 md:px-12 md:pt-22 md:pb-10">
        <SplitText as="h1" text="SHOP" onScroll={false} className="font-display text-7xl leading-[0.9] md:text-[10rem]" />
        <p className="label text-[0.75rem] text-muted">{products.length} pieces</p>
      </div>
      <CategoryFilter categories={categories} active={active} />
      <ProductGrid key={active ?? "all"} products={products} symbol={settings.currencySymbol} />
    </>
  );
}
