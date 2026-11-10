"use client";

import { useState } from "react";
import type { Img } from "@/lib/types";
import { SanityImage } from "./SanityImage";

/** Main photo + thumbnails (desktop) / swipe strip with dots (mobile). */
export function Gallery({ images }: { images: Img[] }) {
  const [active, setActive] = useState(0);
  if (images.length === 0) {
    return (
      <div className="relative aspect-[4/5] w-full">
        <SanityImage sizes="100vw" />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3 md:gap-4">
      <div
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] md:block md:overflow-visible"
        onScroll={(e) => {
          const el = e.currentTarget;
          setActive(Math.round(el.scrollLeft / el.clientWidth));
        }}
      >
        {images.map((img, i) => (
          <div key={img.url + i} className={`relative aspect-[4/5] w-full shrink-0 snap-start bg-ink-2 ${i === active ? "md:block" : "md:hidden"}`}>
            <SanityImage image={img} sizes="(min-width: 768px) 55vw, 100vw" priority={i === 0} />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <div className="flex justify-center gap-1.5 md:hidden" aria-hidden>
            {images.map((_, i) => (
              <span key={i} className={`h-1 transition-all ${i === active ? "w-6 bg-accent" : "w-2 bg-ink-3"}`} />
            ))}
          </div>
          <div className="hidden grid-cols-4 gap-4 md:grid">
            {images.map((img, i) => (
              <button
                key={img.url + i}
                type="button"
                aria-label={`Show photo ${i + 1}`}
                aria-pressed={i === active}
                onClick={() => setActive(i)}
                className={`relative aspect-[4/5] bg-ink-2 ${i === active ? "outline-2 outline-accent" : ""}`}
              >
                <SanityImage image={img} sizes="12vw" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
