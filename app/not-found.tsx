import Link from "next/link";
import { NotFoundContent } from "@/components/layout/NotFound";

export default function GlobalNotFound() {
  return (
    <>
      <header className="border-b border-ink-3 px-5 py-4 md:px-12">
        <Link href="/" aria-label="Carwo home" className="font-display text-3xl">
          CARWO
        </Link>
      </header>
      <main>
        <NotFoundContent />
      </main>
    </>
  );
}
