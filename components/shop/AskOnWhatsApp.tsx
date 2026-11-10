import { buildProductEnquiry, buildWhatsAppUrl, normalizeWhatsAppNumber } from "@/lib/whatsapp";

export function AskOnWhatsApp({ name, slug, whatsappNumber }: { name: string; slug: string; whatsappNumber?: string }) {
  const number = normalizeWhatsAppNumber(whatsappNumber);
  if (!number) return null;
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const href = buildWhatsAppUrl(number, buildProductEnquiry({ name }, `${site}/product/${slug}`));
  return (
    <a href={href} target="_blank" rel="noopener" className="label inline-flex items-center gap-2 hover:text-accent">
      Ask about this on WhatsApp →
    </a>
  );
}
