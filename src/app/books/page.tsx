import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "BookNook | All Books",
};

export default function AllBooksPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 border-b border-stone-200 pb-5">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1C3F3A]">
          All Books
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Browse our complete library collection. Book catalog grid is being integrated in Phase 3.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-[#1C3F3A]">
          <BookOpen className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-serif text-lg font-semibold text-stone-800">
          Library Catalog
        </h3>
        <p className="mt-1 text-sm text-stone-500">
          Dynamic catalog with search, category filtering, and cards will connect here.
        </p>
        <Link href="/" className="mt-6">
          <Button variant="outline" className="border-stone-300">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

