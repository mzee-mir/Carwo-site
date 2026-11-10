import Link from "next/link";
import { SanityImage } from "@/components/shop/SanityImage";
import type { Post } from "@/lib/types";

export const formatDate = (iso: string) =>
  new Date(iso + (iso.length === 10 ? "T00:00:00Z" : "")).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <article className={`group ${featured ? "md:col-span-2 md:grid md:grid-cols-2 md:items-end md:gap-10" : ""}`}>
      <Link href={`/news/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-ink-2" tabIndex={-1} aria-hidden>
        <SanityImage image={post.cover} sizes={featured ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 33vw, 100vw"} className="transition duration-700 group-hover:scale-105" />
      </Link>
      <div className="mt-4 flex flex-col gap-3 md:mt-5">
        <time dateTime={post.publishedAt} className="label text-[0.6875rem] text-accent">
          {formatDate(post.publishedAt)}
        </time>
        <h2 className={`font-display leading-[0.95] uppercase transition-colors group-hover:text-accent ${featured ? "text-5xl md:text-7xl" : "text-3xl md:text-4xl"}`}>
          <Link href={`/news/${post.slug}`}>{post.title}</Link>
        </h2>
        {post.excerpt && <p className="max-w-prose text-muted">{post.excerpt}</p>}
        <span className="label text-[0.75rem]" aria-hidden>
          Read →
        </span>
      </div>
    </article>
  );
}
