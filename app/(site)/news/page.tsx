import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { PostCard } from "@/components/news/PostCard";
import { getPosts } from "@/lib/sanity/data";

export const revalidate = 60;
export const metadata: Metadata = { title: "News", description: "Drops, behind-the-scenes and shop news from Carwo." };

export default async function NewsPage() {
  const posts = await getPosts();
  return (
    <>
      <div className="px-5 pt-10 pb-10 md:px-12 md:pt-22 md:pb-16">
        <p className="label text-[0.75rem] text-accent">Drops · stories · shop news</p>
        <SplitText as="h1" text="NEWS" onScroll={false} className="font-display text-[30vw] leading-[0.85] md:text-[18.75rem]" />
      </div>
      {posts.length === 0 ? (
        <p className="px-5 pb-24 text-muted md:px-12">No news yet — check back soon.</p>
      ) : (
        <div className="grid gap-x-6 gap-y-14 px-5 pb-24 md:grid-cols-2 md:px-12 md:pb-32">
          {posts.map((p, i) => (
            <Reveal key={p._id} className={i === 0 ? "md:col-span-2" : ""}>
              <PostCard post={p} featured={i === 0} />
            </Reveal>
          ))}
        </div>
      )}
    </>
  );
}
