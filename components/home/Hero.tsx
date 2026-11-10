"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { prefersReducedMotion } from "@/components/motion/useMotionPrefs";
import { SanityImage } from "@/components/shop/SanityImage";
import type { Img, SiteSettings } from "@/lib/types";
import { readConnection, shouldPlayHeroVideo } from "./heroVideo";

const LETTERS = "CARWO".split("");

/** Giant CARWO wordmark: letters fly in on load, then spread apart as you scroll over a slow-drifting photo. */
/**
 * Silent looping video layered over the hero photo. It is only added after mount when the connection allows it,
 * and stays invisible until it actually plays — so the photo is what loads first and what shows if anything fails.
 */
function HeroVideo({ video }: { video: NonNullable<SiteSettings["heroVideo"]> }) {
  const [allowed, setAllowed] = useState(false);
  const [playing, setPlaying] = useState(false);
  useEffect(() => setAllowed(shouldPlayHeroVideo(readConnection())), []);
  if (!allowed) return null;
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={() => setPlaying(true)}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${playing ? "opacity-100" : "opacity-0"}`}
    >
      <source src={video.url} type={video.mimeType ?? "video/mp4"} />
    </video>
  );
}

export function Hero({ image, video }: { image?: Img; video?: SiteSettings["heroVideo"] }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      // Intro (letters rising, copy fading in) is CSS so it doesn't wait for JS; GSAP only drives the scroll effects.
      if (!ref.current || prefersReducedMotion()) return;
      const letters = gsap.utils.toArray<HTMLElement>("[data-letter]");
      const st = { trigger: ref.current, start: "top top", end: "bottom top", scrub: true };
      letters.forEach((el, i) => gsap.to(el, { xPercent: (i - (letters.length - 1) / 2) * 35, ease: "none", scrollTrigger: st }));
      gsap.to("[data-hero-media]", { yPercent: 18, scale: 1.08, ease: "none", scrollTrigger: st });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-label="Intro" className="relative flex h-[calc(100svh-6rem)] min-h-[620px] flex-col justify-end overflow-hidden">
      <div data-hero-media className="absolute inset-0 md:left-[47%]">
        <SanityImage image={image} sizes="(min-width: 768px) 55vw, 100vw" priority />
        {video && <HeroVideo video={video} />}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent md:bg-gradient-to-r md:from-ink md:from-35% md:via-ink/70 md:to-transparent" aria-hidden />
      <p data-hero-fade style={{ "--i": 0 } as React.CSSProperties} className="intro-fade label absolute top-6 left-5 text-[0.75rem] text-accent md:top-12 md:left-12">
        Drop 01 — SS27
      </p>
      <p data-hero-fade style={{ "--i": 1 } as React.CSSProperties} className="intro-fade absolute top-4 right-5 font-display text-4xl text-accent md:top-10 md:right-12 md:text-7xl" aria-hidden>
        01
      </p>
      <div className="relative px-5 pb-8 md:px-12 md:pb-14">
        <h1 aria-label="Carwo" className="flex font-display text-[36vw] leading-[0.8] md:text-[30vw] lg:text-[26rem]">
          {LETTERS.map((l, i) => (
            <span key={i} className="-my-[0.06em] inline-block overflow-hidden py-[0.06em]" aria-hidden>
              <span className="intro-rise inline-block" style={{ "--i": i } as React.CSSProperties}>
                <span data-letter className="inline-block">
                  {l}
                </span>
              </span>
            </span>
          ))}
        </h1>
        <p data-hero-fade style={{ "--i": 2 } as React.CSSProperties} className="intro-fade mt-4 max-w-md text-base md:mt-6 md:text-lg">
          Streetwear built loud. Heavyweight cuts for the city — browse, bag it, and order straight on WhatsApp.
        </p>
        <div data-hero-fade style={{ "--i": 3 } as React.CSSProperties} className="intro-fade mt-6 flex flex-col gap-3 sm:flex-row md:mt-8">
          <MagneticButton>
            <Link href="/shop" className="label flex items-center justify-center gap-3 bg-accent px-7 py-4.5 text-ink">
              Shop the drop <span aria-hidden>→</span>
            </Link>
          </MagneticButton>
          <Link href="/lookbook" className="label hidden items-center justify-center border-2 border-paper px-7 py-4 sm:flex">
            View lookbook
          </Link>
        </div>
      </div>
      <p className="label absolute right-5 bottom-8 hidden text-[0.6875rem] text-muted md:right-12 md:block" aria-hidden>
        Scroll ↓
      </p>
    </section>
  );
}
