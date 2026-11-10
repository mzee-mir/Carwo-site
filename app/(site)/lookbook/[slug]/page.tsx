import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Story } from "@/components/lookbook/Story";
import { getStories, getStory } from "@/lib/sanity/data";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getStories()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const story = await getStory((await params).slug);
  if (!story) return { title: "Not found | Carwo" };
  return { title: `${story.title} | Carwo`, description: story.intro, openGraph: { images: [{ url: story.cover.url, alt: story.cover.alt }] } };
}

export default async function StoryPage({ params }: Params) {
  const story = await getStory((await params).slug);
  if (!story) notFound();
  return (
    <>
      <Story story={story} index={0} total={1} heading="h1" />
      <div className="px-5 pb-20 md:px-12">
        <Link href="/lookbook" className="label border-2 border-paper px-7 py-4">
          ← All stories
        </Link>
      </div>
    </>
  );
}
