import Link from "next/link";
import { Atom, BookOpen, ChevronRight, Landmark, Layers, Sparkles } from "lucide-react";

const categories = [
  {
    name: "Fiction",
    description: "Novels, stories & literary fiction",
    icon: BookOpen,
    accent: "bg-emerald-50 text-emerald-800 border-emerald-200 group-hover:bg-emerald-100",
  },
  {
    name: "Science",
    description: "Technology, space & nature",
    icon: Atom,
    accent: "bg-blue-50 text-blue-800 border-blue-200 group-hover:bg-blue-100",
  },
  {
    name: "History",
    description: "Biographies, eras & memoirs",
    icon: Landmark,
    accent: "bg-amber-50 text-amber-800 border-amber-200 group-hover:bg-amber-100",
  },
  {
    name: "Kids",
    description: "Illustrated fables & youth tales",
    icon: Sparkles,
    accent: "bg-purple-50 text-purple-800 border-purple-200 group-hover:bg-purple-100",
  },
  {
    name: "Others",
    description: "Art, philosophy & hobbies",
    icon: Layers,
    accent: "bg-stone-100 text-stone-800 border-stone-200 group-hover:bg-stone-200",
  },
];

export default function FeaturedCategories() {
  return (
    <section className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#1C3F3A] border border-emerald-200">
          <span>Curated Shelves</span>
        </div>
        <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-[#1C3F3A] sm:text-3xl">
          Featured Categories
        </h2>
        <p className="mt-1 max-w-xl mx-auto text-sm text-stone-600">
          Find your next favorite book by exploring our primary library collections.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.name}
              href="/books"
              className="group flex flex-col justify-between rounded-xl border border-stone-200/90 bg-[#FDFBF7] p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#1C3F3A]/40 hover:shadow-md"
            >
              <div>
                <div
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${cat.accent}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-serif text-base font-bold text-stone-900 group-hover:text-[#1C3F3A]">
                  {cat.name}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-stone-500">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 flex items-center text-xs font-semibold text-[#1C3F3A]">
                <span>Explore</span>
                <ChevronRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

