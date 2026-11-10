import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { getSettings } from "@/lib/sanity/data";

export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <AnnouncementBar text={settings.announcement} />
      <Header />
      <main>{children}</main>
      <Footer settings={settings} />
      <div className="grain" aria-hidden />
    </>
  );
}
