import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { normalizeWhatsAppNumber } from "@/lib/whatsapp";

export function Footer({ settings }: { settings: SiteSettings }) {
  const wa = normalizeWhatsAppNumber(settings.whatsappNumber);
  return (
    <footer className="border-t border-ink-3 px-5 pt-16 pb-8 md:px-12">
      <div className="grid gap-10 md:grid-cols-3">
        <div className="flex flex-col gap-3">
          <p className="label text-muted">Shop</p>
          <Link href="/shop">All products</Link>
          <Link href="/lookbook">Lookbook</Link>
          <Link href="/news">News</Link>
        </div>
        <div className="flex flex-col gap-3">
          <p className="label text-muted">Visit</p>
          {settings.address && <p>{settings.address}</p>}
          {settings.hours && <p>{settings.hours}</p>}
          {settings.mapUrl && (
            <a href={settings.mapUrl} target="_blank" rel="noopener">
              Open in Maps →
            </a>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <p className="label text-muted">Follow</p>
          {settings.instagramUrl && (
            <a href={settings.instagramUrl} target="_blank" rel="noopener">
              Instagram
            </a>
          )}
          {wa && (
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener">
              WhatsApp
            </a>
          )}
        </div>
      </div>
      <p aria-hidden className="mt-12 font-display text-[28vw] leading-[0.8]">
        CARWO
      </p>
      <p className="label mt-6 text-muted">© {new Date().getFullYear()} Carwo</p>
    </footer>
  );
}
