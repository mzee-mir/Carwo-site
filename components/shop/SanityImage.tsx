import Image from "next/image";
import type { Img } from "@/lib/types";

type Props = { image?: Img; sizes: string; className?: string; priority?: boolean; fill?: boolean };

/** next/image for CMS/fixture photos, with blur-up when available and a branded fallback when missing. */
export function SanityImage({ image, sizes, className = "", priority, fill = true }: Props) {
  if (!image?.url) {
    return (
      <div className={`flex items-end bg-gradient-to-br from-ink-3 to-ink-2 p-4 ${fill ? "absolute inset-0" : ""} ${className}`} role="img" aria-label="Photo coming soon">
        <span className="font-display text-2xl text-muted">CARWO</span>
      </div>
    );
  }
  const blur = image.lqip ? { placeholder: "blur" as const, blurDataURL: image.lqip } : {};
  return fill ? (
    <Image src={image.url} alt={image.alt} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} {...blur} />
  ) : (
    <Image src={image.url} alt={image.alt} width={image.width} height={image.height} sizes={sizes} priority={priority} className={className} {...blur} />
  );
}
