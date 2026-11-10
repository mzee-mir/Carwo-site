import { notFound } from "next/navigation";
import Image from "next/image";
import { SplitText } from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { Marquee } from "@/components/motion/Marquee";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { HorizontalScroll } from "@/components/motion/HorizontalScroll";
import { PinnedStory } from "@/components/motion/PinnedStory";

/** Development-only playground for the motion components. */
export default function MotionDemo() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <div>
      <section className="px-5 py-24 md:px-12">
        <SplitText as="h1" text="Built loud for the city" onScroll={false} className="font-display text-6xl md:text-9xl" />
        <MagneticButton className="mt-8">
          <a href="#" className="label inline-block bg-accent px-7 py-4 text-ink">
            Magnetic button
          </a>
        </MagneticButton>
      </section>
      <Marquee items={["New drop out now"]} />
      <HorizontalScroll className="py-16">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex aspect-[4/5] w-64 shrink-0 items-end bg-ink-3 p-4 md:w-80">
            <span className="label">Card {i}</span>
          </div>
        ))}
      </HorizontalScroll>
      <PinnedStory
        media={<Image src="/fixtures/s1-cover.jpg" alt="" fill className="object-cover" />}
        title={<p className="font-display text-[18vw] leading-none">STREET SEASON</p>}
      />
      <section className="grid gap-8 px-5 py-24 md:grid-cols-2 md:px-12">
        <Reveal variant="mask">
          <Parallax speed={0.4}>
            <Image src="/fixtures/s1-1.jpg" alt="Look 1" width={1200} height={1500} />
          </Parallax>
        </Reveal>
        <Reveal>
          <p className="font-display text-5xl">Reveal + parallax</p>
        </Reveal>
      </section>
    </div>
  );
}
