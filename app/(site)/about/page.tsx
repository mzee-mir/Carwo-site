import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { SanityImage } from "@/components/shop/SanityImage";
import { getBranches, getSettings } from "@/lib/sanity/data";
import { branchMapUrl } from "@/lib/branches";
import { normalizeWhatsAppNumber } from "@/lib/whatsapp";

export const revalidate = 60;
export const metadata: Metadata = { title: "About & visit", description: "The Carwo story, where to find the shop and how to reach us." };

export default async function AboutPage() {
  const [settings, branches] = await Promise.all([getSettings(), getBranches()]);
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
      <section aria-label="Our branches" className="px-5 py-16 md:px-12 md:py-24">
        <SplitText text={branches.length > 1 ? "OUR BRANCHES" : "VISIT US"} className="pb-8 font-display text-5xl md:pb-12 md:text-8xl" />
        <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {branches.map((b) => {
            const map = branchMapUrl(b);
            const bwa = normalizeWhatsAppNumber(b.whatsappNumber) ?? wa;
            return (
              <article key={b._id} className="flex flex-col gap-4 border border-ink-3 p-6 md:p-8">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-3xl md:text-4xl">{b.name}</h3>
                  {b.isMain && <span className="label shrink-0 bg-accent px-2.5 py-1.5 text-[0.6875rem] text-ink">Main shop</span>}
                </div>
                <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
                  {b.address && (
                    <>
                      <dt className="label text-[0.6875rem] text-muted">Address</dt>
                      <dd>{b.address}</dd>
                    </>
                  )}
                  {b.hours && (
                    <>
                      <dt className="label text-[0.6875rem] text-muted">Hours</dt>
                      <dd>{b.hours}</dd>
                    </>
                  )}
                  {b.phone && (
                    <>
                      <dt className="label text-[0.6875rem] text-muted">Phone</dt>
                      <dd>
                        <a href={`tel:${b.phone.replace(/[^\d+]/g, "")}`} className="hover:text-accent">
                          {b.phone}
                        </a>
                      </dd>
                    </>
                  )}
                </dl>
                <div className="mt-auto flex flex-wrap gap-3 pt-2">
                  {map && (
                    <a href={map} target="_blank" rel="noopener" className="label border-2 border-paper px-5 py-3 hover:border-accent hover:text-accent">
                      Open in Maps
                    </a>
                  )}
                  {bwa && (
                    <a href={`https://wa.me/${bwa}`} target="_blank" rel="noopener" className="label bg-wa px-5 py-3.5 text-ink">
                      WhatsApp
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        {settings.instagramUrl && (
          <a href={settings.instagramUrl} target="_blank" rel="noopener" className="label mt-10 inline-block border-2 border-paper px-6 py-3.5">
            Instagram
          </a>
        )}
      </section>
    </>
  );
}
