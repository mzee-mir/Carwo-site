import Link from "next/link";
import type { Category } from "@/lib/types";

export function CategoryFilter({ categories, active }: { categories: Category[]; active?: string }) {
  const items = [{ slug: undefined, title: "All" }, ...categories.map((c) => ({ slug: c.slug, title: c.title }))];
  return (
    <nav aria-label="Categories" className="flex gap-2 overflow-x-auto px-5 pb-6 [scrollbar-width:none] md:gap-3 md:px-12 md:pb-10">
      {items.map((c) => {
        const on = c.slug === active;
        return (
          <Link
            key={c.title}
            href={c.slug ? `/shop?category=${c.slug}` : "/shop"}
            aria-current={on ? "page" : undefined}
            className={`label shrink-0 rounded-full px-4 py-2.5 text-[0.75rem] transition-colors md:px-5 md:py-3 ${on ? "bg-accent text-ink" : "border border-ink-3 hover:border-paper"}`}
          >
            {c.title}
          </Link>
        );
      })}
    </nav>
  );
}
