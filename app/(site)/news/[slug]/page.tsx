import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "next-sanity";
import { PostCard, formatDate } from "@/components/news/PostCard";
import { SanityImage } from "@/components/shop/SanityImage";
import { imageUrl } from "@/lib/sanity/image";
import { getPost, getPosts } from "@/lib/sanity/data";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: "article", publishedTime: post.publishedAt, images: post.cover ? [{ url: post.cover.url, alt: post.cover.alt }] : undefined },
  };
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-lg leading-relaxed md:text-xl">{children}</p>,
    h2: ({ children }) => <h2 className="pt-6 font-display text-4xl uppercase md:text-5xl">{children}</h2>,
    blockquote: ({ children }) => <blockquote className="border-l-4 border-accent pl-6 font-display text-3xl md:text-4xl">{children}</blockquote>,
  },
  marks: {
    link: ({ children, value }) => (
      <a href={value?.href} target="_blank" rel="noopener" className="text-accent underline underline-offset-4">
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      const src = imageUrl(value);
      return src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={value?.alt ?? ""} loading="lazy" className="w-full" />
      ) : null;
    },
  },
};

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const more = (await getPosts()).filter((p) => p._id !== post._id).slice(0, 2);
  return (
    <>
      <article className="px-5 pt-10 pb-16 md:px-12 md:pt-22 md:pb-24">
        <header className="mx-auto max-w-4xl">
          <time dateTime={post.publishedAt} className="label text-[0.75rem] text-accent">
            {formatDate(post.publishedAt)}
          </time>
          <h1 className="mt-4 font-display text-6xl leading-[0.9] uppercase md:text-8xl">{post.title}</h1>
          {post.excerpt && <p className="mt-6 text-xl text-muted md:text-2xl">{post.excerpt}</p>}
        </header>
        {post.cover && (
          <div className="relative mx-auto mt-10 aspect-[16/9] max-w-6xl overflow-hidden md:mt-14">
            <SanityImage image={post.cover} sizes="(min-width: 1200px) 1152px, 100vw" priority />
          </div>
        )}
        <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-6 md:mt-14">
          <PortableText value={post.body} components={components} />
        </div>
        <div className="mx-auto mt-14 max-w-3xl">
          <Link href="/news" className="label inline-block border-2 border-paper px-6 py-3.5 hover:border-accent hover:text-accent">
            ← All news
          </Link>
        </div>
      </article>
      {more.length > 0 && (
        <section aria-label="More news" className="border-t border-ink-3 px-5 py-16 md:px-12 md:py-24">
          <p className="label pb-8 text-[0.75rem] text-muted">More news</p>
          <div className="grid gap-14 md:grid-cols-2 md:gap-6">
            {more.map((p) => (
              <PostCard key={p._id} post={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
