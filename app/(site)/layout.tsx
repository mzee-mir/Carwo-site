import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { PageTransition } from "@/components/motion/PageTransition";
import { Cursor } from "@/components/motion/Cursor";
import { getSettings } from "@/lib/sanity/data";
import { CartButton } from "@/components/cart/CartButton";
import { CartDrawer } from "@/components/cart/CartDrawer";

export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <SmoothScroll>
      <AnnouncementBar text={settings.announcement} />
      <Header cartSlot={<CartButton />} />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer settings={settings} />
      <CartDrawer settings={settings} />
      <Cursor />
      <div className="grain" aria-hidden />
    </SmoothScroll>
  );
}
