import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar text="Drop 01 out now ✦ Order on WhatsApp" />
      <Header />
      <main>{children}</main>
      <Footer />
      <div className="grain" aria-hidden />
    </>
  );
}
