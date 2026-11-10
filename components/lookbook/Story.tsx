import Link from "next/link";
import { Parallax } from "@/components/motion/Parallax";
import { PinnedStory } from "@/components/motion/PinnedStory";
import { Reveal } from "@/components/motion/Reveal";
import { SanityImage } from "@/components/shop/SanityImage";
import type { LookbookStory } from "@/lib/types";

// Staggered editorial layout for up to 6 looks (repeats after that); speeds give the layered parallax.
const LAYOUT = [
  { box: "md:col-span-5 md:col-start-1", speed: 0.15 },
  { box: "md:col-span-4 md:col-start-8 md:mt-56", speed: -0.25 },
  { box: "md:col-span-6 md:col-start-3", speed: 0.2 },
  { box: "md:col-span-4 md:col-start-1 md:mt-24", speed: -0.2 },
  { box: "md:col-span-5 md:col-start-7", speed: 0.25 },
  { box: "md:col-span-4 md:col-start-3", speed: -0.15 },
];

export function Story({ story, index, total, heading = "h2" }: { story: LookbookStory; index: number; total: number; heading?: "h1" | "h2" }) {
  const H = heading;
  const num = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  return (
    <article>
      <PinnedStory
        media={<SanityImage image={story.cover} sizes="100vw" priority={index === 0} />}
        title={<H className="font-display text-[26vw] leading-[0.85] uppercase md:text-[19rem]">{story.title}</H>}
      >
        <p className="label absolute top-22 left-5 text-[0.75rem] text-accent md:top-28 md:left-12">{num}</p>
        <div className="absolute right-5 bottom-6 left-5 flex flex-col gap-4 md:right-12 md:bottom-12 md:left-12 md:flex-row md:items-end md:justify-between">
          {story.intro && <p className="max-w-sm md:text-lg">{story.intro}</p>}
          <Link href="/shop" className="label w-fit bg-accent px-7 py-4 text-ink">
            Shop this look
          </Link>
        </div>
      </PinnedStory>
      <div className="grid grid-cols-2 gap-x-3 gap-y-10 px-5 py-16 md:grid-cols-12 md:gap-x-6 md:gap-y-24 md:px-12 md:py-32">
        {story.slides.map((s, i) => {
          const l = LAYOUT[i % LAYOUT.length];
          return (
            <figure key={i} className={`${i % 3 === 2 ? "col-span-2" : "col-span-1"} ${l.box} ${i % 2 === 1 ? "mt-16 md:mt-0" : ""}`}>
              <Parallax speed={l.speed}>
                <Reveal variant="mask" className="relative aspect-[4/5] overflow-hidden">
                  <SanityImage image={s.image} sizes="(min-width: 768px) 40vw, 50vw" />
                </Reveal>
              </Parallax>
              {s.caption && <figcaption className="label mt-3 text-[0.6875rem] text-muted">{s.caption}</figcaption>}
            </figure>
          );
        })}
      </div>
    </article>
  );
}
