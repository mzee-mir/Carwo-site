/** Endless sideways text band. Pure CSS; stops for reduced motion. */
export function Marquee({ items, speed = 30, className = "" }: { items: string[]; speed?: number; className?: string }) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <span key={i} className="flex items-center gap-8 font-display text-2xl whitespace-nowrap md:text-4xl">
          {t}
          <span aria-hidden>✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className={`overflow-hidden bg-accent py-3 text-ink md:py-4 ${className}`}>
      <div className="marquee-track flex w-max" style={{ animationDuration: `${speed}s` }}>
        {row(false)}
        {row(true)}
        {row(true)}
        {row(true)}
      </div>
    </div>
  );
}
