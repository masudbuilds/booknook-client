import Link from "next/link";
import { BookOpen, Bookmark, Library } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-800/20 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-[#1C3F3A]">
          <Library className="h-3.5 w-3.5" />
          <span>A Cozy Community Library</span>
        </div>

        <h1 className="font-serif text-4xl font-bold tracking-tight text-[#1C3F3A] sm:text-6xl">
          Add a book, borrow a book, return a book.
        </h1>

        <p className="mx-auto max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
          Welcome to BookNook. Discover captivating reads from fellow members, borrow titles for your quiet reading hours, and contribute your favorite stories.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link href="/books">
            <Button size="lg" className="bg-[#1C3F3A] text-white hover:bg-[#15302C]">
              <BookOpen className="mr-2 h-4 w-4" />
              Browse Books
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="border-stone-300 text-stone-800 hover:bg-stone-100">
              <Bookmark className="mr-2 h-4 w-4 text-[#C86244]" />
              Join the Library
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
