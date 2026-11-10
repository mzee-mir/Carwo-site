import { Hero } from "@/components/home/Hero";
import { FeaturedCollections, LookbookTeaser, NewDropStrip, SocialCta } from "@/components/home/Sections";
import { Marquee } from "@/components/motion/Marquee";
import { getProducts, getSettings, getStories } from "@/lib/sanity/data";

export const revalidate = 60;

export default async function HomePage() {
  const [settings, newDrop, stories] = await Promise.all([getSettings(), getProducts({ newDrop: true }), getStories()]);
  return (
    <>
      <Hero image={settings.heroImage} />
      <Marquee items={["New drop out now", "Order on WhatsApp", "Pickup in store"]} />
      <NewDropStrip products={newDrop} symbol={settings.currencySymbol} />
      <FeaturedCollections stories={stories} />
      <LookbookTeaser story={stories[0]} />
      <SocialCta settings={settings} />
    </>
  );
}
