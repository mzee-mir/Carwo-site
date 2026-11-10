"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart/store";
import { formatPrice, isSoldOut } from "@/lib/format";
import type { Product } from "@/lib/types";

/** Colour + size pickers and the Add to cart button. */
export function AddToCart({ product, symbol }: { product: Product; symbol: string }) {
  const add = useCart((s) => s.add);
  const soldOut = isSoldOut(product);
  const onlySize = product.sizes.length === 1 && product.sizes[0].inStock ? product.sizes[0].label : null;
  const [colour, setColour] = useState(product.colours[0]?.name ?? "");
  const [size, setSize] = useState<string | null>(onlySize);
  const [error, setError] = useState(false);
  const price = formatPrice(product.price, { currencySymbol: symbol });

  function onAdd() {
    if (!size) {
      setError(true);
      return;
    }
    add({ productId: product._id, slug: product.slug, name: product.name, size, colour, unitPrice: product.price, image: product.images[0]?.url });
  }

  return (
    <div className="flex flex-col gap-7">
      {product.colours.length > 0 && (
        <fieldset className="flex flex-col gap-3">
          <legend className="label mb-3 text-[0.75rem] text-muted">Colour — {colour}</legend>
          <div className="flex flex-wrap gap-2.5">
            {product.colours.map((c) => (
              <button
                key={c.name}
                type="button"
                aria-pressed={c.name === colour}
                onClick={() => setColour(c.name)}
                className={`label flex items-center gap-2.5 rounded-full border-[1.5px] py-1.5 pr-3.5 pl-1.5 text-[0.75rem] ${c.name === colour ? "border-paper" : "border-ink-3"}`}
              >
                <span className="size-6 rounded-full border border-ink-3" style={{ background: c.hex }} aria-hidden />
                {c.name}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      <fieldset className="flex flex-col gap-3">
        <legend className="label mb-3 flex w-full justify-between text-[0.75rem] text-muted">Size</legend>
        <div className="flex flex-wrap gap-2.5">
          {product.sizes.map((s) => (
            <button
              key={s.label}
              type="button"
              disabled={!s.inStock}
              aria-pressed={s.label === size}
              onClick={() => {
                setSize(s.label);
                setError(false);
              }}
              className={`label h-12 min-w-14 border-[1.5px] px-3 transition active:scale-95 disabled:border-ink-3 disabled:text-muted disabled:line-through ${s.label === size ? "border-paper bg-paper text-ink" : "border-paper"}`}
            >
              {s.label}
            </button>
          ))}
        </div>
        {error && (
          <p role="alert" className="text-sm text-danger">
            Choose a size
          </p>
        )}
      </fieldset>
      <button
        type="button"
        onClick={onAdd}
        disabled={soldOut}
        aria-label={soldOut ? "Add to cart — sold out" : undefined}
        className="label flex items-center justify-center gap-3 bg-accent px-7 py-5 text-ink transition hover:brightness-110 active:scale-[0.99] disabled:bg-ink-3 disabled:text-muted"
      >
        {soldOut ? "Sold out" : `Add to cart — ${price}`}
      </button>
    </div>
  );
}
