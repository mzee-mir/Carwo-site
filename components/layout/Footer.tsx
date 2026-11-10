import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-ink-3 px-5 pt-16 pb-8 md:px-12">
      <div className="grid gap-10 md:grid-cols-3">
        <div className="flex flex-col gap-3">
          <p className="label text-muted">Shop</p>
          <Link href="/shop">All products</Link>
          <Link href="/lookbook">Lookbook</Link>
        </div>
        <div className="flex flex-col gap-3">
          <p className="label text-muted">Visit</p>
          <Link href="/about">Find the shop</Link>
        </div>
        <div className="flex flex-col gap-3">
          <p className="label text-muted">Follow</p>
          <a href="https://instagram.com" target="_blank" rel="noopener">Instagram</a>
          <a href="https://wa.me/" target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </div>
      <p aria-hidden className="mt-12 font-display text-[28vw] leading-[0.8]">CARWO</p>
      <p className="label mt-6 text-muted">© {new Date().getFullYear()} Carwo</p>
    </footer>
  );
}
