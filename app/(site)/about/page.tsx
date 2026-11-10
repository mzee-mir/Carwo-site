import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { SanityImage } from "@/components/shop/SanityImage";
import { getSettings } from "@/lib/sanity/data";
import { normalizeWhatsAppNumber } from "@/lib/whatsapp";

export const revalidate = 60;
export const metadata: Metadata = { title: "About & visit", description: "The Carwo story, where to find the shop and how to reach us." };

export default async function AboutPage() {
  const settings = await getSettings();
  const wa = normalizeWhatsAppNumber(settings.whatsappNumber);
  return (
    <>
      <section className="px-5 pt-10 pb-16 md:px-12 md:pt-22 md:pb-24">
        <p className="label text-[0.75rem] text-accent">About Carwo</p>
        <SplitText as="h1" text="MADE IN THE CITY. WORN LOUD." onScroll={false} className="max-w-6xl font-display text-6xl leading-[0.9] md:text-[8.5rem]" />
        <div className="mt-8 grid gap-6 md:mt-12 md:grid-cols-2 md:gap-16">
          <p className="text-lg md:text-xl">
            Carwo is streetwear for people who don&apos;t blend in. Heavyweight cuts, loud colour and pieces made to be worn hard — dropped in small runs so you won&apos;t see
            yourself coming down the street.
          </p>
          <p className="text-muted md:text-lg">
            Browse the drop online, bag what you like, and send your order straight to us on WhatsApp. Pick it up in store or we&apos;ll sort delivery.
          </p>
        </div>
      </section>
      {settings.heroImage && (
        <Reveal variant="mask" className="relative mx-5 aspect-[16/10] overflow-hidden md:mx-12">
          <SanityImage image={settings.heroImage} sizes="100vw" />
        </Reveal>
      )}
      <section aria-label="Visit and contact" className="grid gap-10 px-5 py-16 md:grid-cols-3 md:px-12 md:py-24">
        <div className="flex flex-col gap-3">
          <h2 className="label text-muted">Visit</h2>
          {settings.address && <p className="font-display text-3xl md:text-4xl">{settings.address}</p>}
          {settings.mapUrl && (
            <a href={settings.mapUrl} target="_blank" rel="noopener" className="label w-fit border-b-2 border-accent pb-1 hover:text-accent">
              Open in Maps
            </a>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="label text-muted">Hours</h2>
          {settings.hours && <p className="font-display text-3xl md:text-4xl">{settings.hours}</p>}
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="label text-muted">Talk to us</h2>
          {wa && (
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener" className="label w-fit bg-wa px-6 py-4 text-ink">
              WhatsApp
            </a>
          )}
          {settings.instagramUrl && (
            <a href={settings.instagramUrl} target="_blank" rel="noopener" className="label w-fit border-2 border-paper px-6 py-3.5">
              Instagram
            </a>
          )}
        </div>
      </section>
    </>
  );
}
