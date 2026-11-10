import Link from "next/link";
import { HorizontalScroll } from "@/components/motion/HorizontalScroll";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { ProductCard } from "@/components/shop/ProductCard";
import { SanityImage } from "@/components/shop/SanityImage";
import type { LookbookStory, Product, SiteSettings } from "@/lib/types";
import { normalizeWhatsAppNumber } from "@/lib/whatsapp";

export function NewDropStrip({ products, symbol }: { products: Product[]; symbol: string }) {
  if (products.length === 0) return null;
  return (
    <section aria-label="New drop" className="pt-18 pb-18 md:pt-30 md:pb-0">
      <div className="flex items-end justify-between px-5 pb-6 md:px-12 md:pb-10">
        <div>
          <p className="label text-[0.75rem] text-accent">Just landed</p>
          <SplitText text="NEW DROP" className="font-display text-6xl leading-[0.95] md:text-[7.5rem]" />
        </div>
        <p className="label hidden text-[0.75rem] text-muted md:block">
          01 — {String(products.length).padStart(2, "0")} &nbsp; Scroll →
        </p>
      </div>
      <HorizontalScroll className="md:flex md:h-svh md:items-center">
        {products.map((p) => (
          <div key={p._id} className="w-64 shrink-0 md:w-[340px]">
            <ProductCard product={p} symbol={symbol} sizes="340px" />
          </div>
        ))}
        <Link href="/shop" className="flex aspect-[4/5] w-64 shrink-0 items-center justify-center border border-ink-3 font-display text-4xl hover:border-accent hover:text-accent md:w-[340px]">
          SEE ALL →
        </Link>
      </HorizontalScroll>
      <p className="label px-5 pt-4 text-[0.6875rem] text-muted md:hidden">Swipe →</p>
    </section>
  );
}

export function FeaturedCollections({ stories }: { stories: LookbookStory[] }) {
  if (stories.length === 0) return null;
  return (
    <section aria-label="Collections" className="px-5 pb-18 md:px-12 md:pb-30">
      <SplitText text="COLLECTIONS" className="pb-6 font-display text-5xl md:pb-10 md:text-8xl" />
      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        {stories.map((s, i) => (
          <Reveal key={s._id} variant="mask" delay={i * 0.1}>
            <Link href={`/lookbook/${s.slug}`} className="group relative block aspect-[4/5] overflow-hidden md:aspect-[11/12]">
              <SanityImage image={s.cover} sizes="(min-width: 768px) 50vw, 100vw" className="transition duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" aria-hidden />
              <span className="absolute top-5 left-5 font-display text-3xl text-accent md:top-8 md:left-8 md:text-5xl">{String(i + 1).padStart(2, "0")}</span>
              <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8">
                <h3 className="font-display text-4xl uppercase md:text-7xl">{s.title}</h3>
                <p className="label mt-2 text-[0.75rem]">Explore →</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function LookbookTeaser({ story }: { story?: LookbookStory }) {
  if (!story) return null;
  return (
    <section aria-label="Lookbook" className="grid items-center gap-6 px-5 pb-18 md:grid-cols-2 md:gap-20 md:px-12 md:pb-30">
      <Reveal variant="mask" className="relative aspect-[4/5] overflow-hidden">
        <Parallax speed={0.35} className="absolute -inset-y-[10%] inset-x-0">
          <SanityImage image={story.slides[0]?.image ?? story.cover} sizes="(min-width: 768px) 50vw, 100vw" />
        </Parallax>
      </Reveal>
      <div className="flex flex-col gap-5 md:gap-7">
        <p className="label text-[0.75rem] text-accent">Lookbook {story.season ? `— ${story.season}` : ""}</p>
        <SplitText text="SHOT ON THE STREETS WE GREW UP ON." className="font-display text-5xl leading-[0.95] md:text-7xl" />
        {story.intro && <p className="max-w-md text-muted md:text-lg">{story.intro}</p>}
        <Link href="/lookbook" className="label w-fit border-2 border-paper px-7 py-4 hover:border-accent hover:text-accent">
          Open the lookbook
        </Link>
      </div>
    </section>
  );
}

export function SocialCta({ settings }: { settings: SiteSettings }) {
  const wa = normalizeWhatsAppNumber(settings.whatsappNumber);
  return (
    <section aria-label="Order on WhatsApp" className="bg-accent px-5 py-16 text-ink md:px-12 md:py-24">
      <SplitText text="SEE IT. BAG IT. SEND IT ON WHATSAPP." className="max-w-5xl font-display text-5xl leading-[0.95] md:text-[7.5rem]" />
      <div className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-10">
        <MagneticButton>
          <Link href="/shop" className="label flex justify-center bg-ink px-7 py-4.5 text-paper">
            Shop now
          </Link>
        </MagneticButton>
        {wa && (
          <MagneticButton>
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener" className="label flex justify-center bg-wa px-7 py-4.5">
              Chat on WhatsApp
            </a>
          </MagneticButton>
        )}
        {settings.instagramUrl && (
          <a href={settings.instagramUrl} target="_blank" rel="noopener" className="label flex justify-center border-2 border-ink px-7 py-4">
            Instagram
          </a>
        )}
      </div>
    </section>
  );
}
