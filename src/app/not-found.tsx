import Link from "next/link";
import { BookOpen, Compass, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "BookNook | Page Not Found",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-16rem)] flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#EAE2D5]/50 border border-[#E5DED2] text-[#987A50] shadow-xs">
          <Compass className="h-10 w-10 text-[#987A50] animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="font-serif text-6xl font-bold tracking-tight text-[#292820] sm:text-7xl">
            404
          </span>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#292820] sm:text-3xl">
            Lost in the Stacks?
          </h1>
          <p className="text-sm leading-relaxed text-stone-600 sm:text-base">
            We couldn&apos;t find the book or page you were looking for. It may have been relocated, shelved in a different section, or perhaps never written.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row w-full sm:w-auto">
          <Link href="/" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="bg-[#292820] text-[#F7F4ED] hover:bg-[#987A50] shadow-sm w-full sm:w-auto transition-colors"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/books" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="border-[#E5DED2] text-[#292820] hover:bg-[#EAE2D5] w-full sm:w-auto transition-colors"
            >
              <BookOpen className="mr-2 h-4 w-4 text-[#987A50]" />
              Browse Catalog
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

