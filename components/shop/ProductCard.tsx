import Link from "next/link";
import { formatPrice, isSoldOut } from "@/lib/format";
import type { Product } from "@/lib/types";
import { SanityImage } from "./SanityImage";

export function ProductCard({ product, symbol, sizes = "(min-width: 768px) 25vw, 50vw" }: { product: Product; symbol: string; sizes?: string }) {
  const soldOut = isSoldOut(product);
  const [front, back] = product.images;
  return (
    <article className="group">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-ink-2">
          <SanityImage image={front} sizes={sizes} className={`transition duration-700 ease-out group-hover:scale-105 ${soldOut ? "opacity-45" : ""}`} />
          {back && (
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <SanityImage image={back} sizes={sizes} />
            </div>
          )}
          {soldOut ? (
            <span className="label absolute top-3 left-3 bg-paper px-2.5 py-1.5 text-[0.6875rem] text-ink">Sold out</span>
          ) : product.newDrop ? (
            <span className="label absolute top-3 left-3 bg-accent px-2.5 py-1.5 text-[0.6875rem] text-ink">New</span>
          ) : null}
        </div>
        <div className="mt-3 flex flex-col gap-1">
          <h3 className="font-display text-xl leading-tight transition-colors group-hover:text-accent md:text-2xl">{product.name}</h3>
          <p className={`text-sm font-semibold ${soldOut ? "text-muted" : ""}`}>{formatPrice(product.price, { currencySymbol: symbol })}</p>
          <p className="text-sm text-muted">{soldOut ? "Back soon" : product.colours.map((c) => c.name).join(" · ")}</p>
        </div>
      </Link>
    </article>
  );
}
