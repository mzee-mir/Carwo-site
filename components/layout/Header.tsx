"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/news", label: "News" },
  { href: "/about", label: "About" },
];

export function Header({ cartSlot }: { cartSlot?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // Close the mobile menu whenever the page changes (logo, nav, any link) …
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }
  // … and on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <header className="sticky top-0 z-40 border-b border-ink-3 bg-ink/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-5 md:px-12">
        <button
          type="button"
          className="-m-3 p-3 md:hidden"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            {open ? (
              <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2" />
            ) : (
              <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="2" />
            )}
          </svg>
        </button>
        <Link href="/" aria-label="Carwo home" className="py-2 font-display text-3xl tracking-wide">
          CARWO
        </Link>
        <nav
          id="main-nav"
          aria-label="Main"
          className={`${open ? "flex" : "hidden"} absolute inset-x-0 top-16 flex-col gap-6 border-b border-ink-3 bg-ink px-5 py-8 md:static md:flex md:flex-row md:gap-10 md:border-0 md:bg-transparent md:p-0`}
        >
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="label py-3 hover:text-accent md:py-4" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="min-w-6">{cartSlot}</div>
      </div>
    </header>
  );
}
