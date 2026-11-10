import { Reveal } from "@/components/motion/Reveal";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  products,
  symbol,
}: {
  products: Product[];
  symbol: string;
}) {
  if (products.length === 0) {
    return (
      <p className="px-5 pb-24 text-muted md:px-12">
        Nothing here yet — check back soon.
      </p>
    );
  }
  return (
    <>
      <h2 className="sr-only">Products</h2>
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 px-5 pb-20 md:grid-cols-4 md:gap-x-6 md:gap-y-14 md:px-12 md:pb-32">
        {products.map((p, i) => (
          <Reveal key={p._id} delay={(i % 4) * 0.06}>
            <ProductCard product={p} symbol={symbol} />
          </Reveal>
        ))}
      </div>
    </>
  );
}
