import type { Metadata } from "next";
import Link from "next/link";
import { Story } from "@/components/lookbook/Story";
import { Marquee } from "@/components/motion/Marquee";
import { SplitText } from "@/components/motion/SplitText";
import { getStories } from "@/lib/sanity/data";

export const revalidate = 60;
export const metadata: Metadata = { title: "Lookbook | Carwo", description: "Carwo collections, shot on the streets." };

export default async function LookbookPage() {
  const stories = await getStories();
  const looks = stories.reduce((n, s) => n + s.slides.length, 0);
  return (
    <>
      <div className="px-5 pt-10 pb-10 md:px-12 md:pt-22 md:pb-18">
        <p className="label text-[0.75rem] text-accent">
          {stories.length} stories · {looks} looks
        </p>
        <SplitText as="h1" text="LOOKBOOK" onScroll={false} className="font-display text-[24vw] leading-[0.85] md:text-[18.75rem]" />
      </div>
      {stories.map((s, i) => (
        <Story key={s._id} story={s} index={i} total={stories.length} />
      ))}
      <Marquee items={["The city is the runway"]} />
      <section className="px-5 py-16 md:px-12 md:py-24">
        <h2 className="font-display text-5xl md:text-8xl">LIKE WHAT YOU SAW?</h2>
        <Link href="/shop" className="label mt-6 inline-block bg-accent px-7 py-4 text-ink md:mt-8">
          Shop the full drop
        </Link>
      </section>
    </>
  );
}
