import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/shop/AddToCart";
import { AskOnWhatsApp } from "@/components/shop/AskOnWhatsApp";
import { Gallery } from "@/components/shop/Gallery";
import { ProductCard } from "@/components/shop/ProductCard";
import { formatPrice } from "@/lib/format";
import { getProduct, getProducts, getSettings } from "@/lib/sanity/data";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: product.images[0] ? [{ url: product.images[0].url, alt: product.images[0].alt }] : undefined },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([getProduct(slug), getSettings()]);
  if (!product) notFound();
  const related = (await getProducts({ category: product.category.slug })).filter((p) => p._id !== product._id);
  const more = related.length >= 4 ? related : [...related, ...(await getProducts()).filter((p) => p._id !== product._id && !related.includes(p))];
  const symbol = settings.currencySymbol;
  return (
    <>
      <div className="grid gap-0 pb-12 md:grid-cols-[minmax(0,55fr)_minmax(0,45fr)] md:gap-16 md:px-12 md:pt-10 md:pb-28">
        <Gallery images={product.images} />
        <div className="flex flex-col gap-6 px-5 pt-6 md:sticky md:top-24 md:self-start md:px-0 md:pt-0">
          <p className="label text-[0.75rem] text-muted">
            <Link href="/shop">Shop</Link> / <Link href={`/shop?category=${product.category.slug}`}>{product.category.title}</Link>
          </p>
          {product.newDrop && <span className="label w-fit bg-accent px-2.5 py-1.5 text-[0.6875rem] text-ink">New</span>}
          <h1 className="font-display text-6xl leading-[0.92] uppercase md:text-8xl">{product.name}</h1>
          <p className="font-display text-3xl text-accent">{formatPrice(product.price, { currencySymbol: symbol })}</p>
          <AddToCart product={product} symbol={symbol} />
          <AskOnWhatsApp name={product.name} slug={product.slug} whatsappNumber={settings.whatsappNumber} />
          {product.description && <p className="max-w-prose text-muted">{product.description}</p>}
          <div className="border-b border-ink-3">
            {[
              ["Pickup & delivery", "Collect in store or arrange delivery when you order on WhatsApp."],
              ["Care", "Cold wash inside out. Hang dry."],
            ].map(([q, a]) => (
              <details key={q} className="group border-t border-ink-3 py-4">
                <summary className="label flex cursor-pointer list-none justify-between text-[0.75rem]">
                  {q} <span className="transition group-open:rotate-45">+</span>
                </summary>
                <p className="pt-3 text-sm text-muted">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
      <section className="pb-24 md:pb-32">
        <h2 className="px-5 pb-6 font-display text-4xl md:px-12 md:pb-8 md:text-7xl">YOU MIGHT ALSO LIKE</h2>
        <div className="flex gap-3 overflow-x-auto px-5 [scrollbar-width:none] md:grid md:grid-cols-4 md:gap-6 md:px-12">
          {more.slice(0, 4).map((p) => (
            <div key={p._id} className="w-52 shrink-0 md:w-auto">
              <ProductCard product={p} symbol={symbol} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
