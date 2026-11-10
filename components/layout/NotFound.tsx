import Link from "next/link";

export function NotFoundContent() {
  return (
    <section className="flex min-h-[70svh] flex-col items-start justify-center gap-6 px-5 py-20 md:px-12">
      <p className="label text-[0.75rem] text-accent">Error 404</p>
      <h1 className="font-display text-[30vw] leading-[0.8] md:text-[20rem]">LOST?</h1>
      <p className="max-w-md text-lg text-muted">This page sold out — or never existed. The good stuff is this way.</p>
      <Link href="/shop" className="label bg-accent px-7 py-4 text-ink">
        Back to shop
      </Link>
    </section>
  );
}
