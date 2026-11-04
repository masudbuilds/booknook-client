import Link from "next/link";
import { ArrowUpRight, Atom, BookOpen, Compass, Layers, Sparkles } from "lucide-react";

const categories = [
  {
    name: "Fiction",
    description: "Novels, stories & literary masterpieces",
    icon: BookOpen,
  },
  {
    name: "Science",
    description: "Technology, physics, astronomy & nature",
    icon: Atom,
  },
  {
    name: "History",
    description: "Eras, memoirs, biographies & chronicles",
    icon: Compass,
  },
  {
    name: "Kids",
    description: "Illustrated fables, fairy tales & youth lore",
    icon: Sparkles,
  },
  {
    name: "Others",
    description: "Philosophy, art, essays & varied crafts",
    icon: Layers,
  },
];

export default function FeaturedCategories() {
  return (
    <section className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-booknook-border pb-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-booknook-accent">
            Thematic Shelves
          </span>
          <h2 className="mt-1 font-serif text-3xl sm:text-4xl text-booknook-text font-normal tracking-tight">
            Featured Categories
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-booknook-text/70 font-light">
            Explore our collection arranged across five primary literary genres.
          </p>
        </div>

        <Link
          href="/books"
          className="text-xs uppercase tracking-widest font-medium text-booknook-text hover:text-booknook-accent transition-colors pb-1 border-b border-booknook-text/40 hover:border-booknook-accent w-fit"
        >
          View Full Catalog
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3.5 sm:gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.name}
              href="/books"
              aria-label={`Browse ${cat.name} books shelf`}
              className="group flex flex-col justify-between rounded-sm border border-booknook-border bg-booknook-white p-4 sm:p-5 lg:p-6 transition-all duration-300 hover:border-booknook-accent hover:-translate-y-0.5 hover:shadow-md last:col-span-2 sm:last:col-span-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-booknook-accent focus-visible:ring-offset-2"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-booknook-secondary/50 text-booknook-accent transition-colors group-hover:bg-booknook-text group-hover:text-booknook-bg">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-serif text-lg font-normal text-booknook-text group-hover:text-booknook-accent transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-booknook-text/65 font-light">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-booknook-border/50 flex items-center justify-between text-[11px] uppercase tracking-wider font-medium text-booknook-text/80 group-hover:text-booknook-accent transition-colors">
                <span>Browse Shelf</span>
                <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
