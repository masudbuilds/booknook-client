import Link from "next/link";
import { ArrowRight, BookMarked, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-sm border border-[#E5DED2] shadow-xs">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1507842229451-9f7a177ce533?auto=format&fit=crop&w=1800&q=80"
          alt="Warm bookstore with shelves of books"
          className="h-full w-full object-cover object-center"
        />
        {/* Editorial overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#292820]/92 via-[#292820]/75 to-[#292820]/45 sm:from-[#292820]/95 sm:via-[#292820]/80 sm:to-[#292820]/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-5 py-14 sm:px-12 sm:py-24 md:px-16 lg:px-20 max-w-4xl space-y-5 sm:space-y-6">
        <div className="inline-flex items-center gap-2 rounded-xs bg-[#EAE2D5]/20 backdrop-blur-xs px-3 py-1 text-[10px] sm:text-[11px] font-medium tracking-[0.2em] text-[#EAE2D5] border border-white/15 uppercase">
          <Sparkles className="h-3 w-3 text-[#987A50]" />
          <span>A Curated Community Library</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.12] sm:leading-[1.08] tracking-tight text-[#F7F4ED]">
          Where Stories Find Their Readers
        </h1>

        <p className="max-w-xl text-xs sm:text-base md:text-lg font-light leading-relaxed text-[#EAE2D5]/90">
          Step into a quiet sanctuary crafted for book lovers. Explore thousands of community-shared titles, borrow copies with ease, and celebrate the timeless art of literature.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link href="/books" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-[#987A50] text-[#F7F4ED] hover:bg-[#856942] active:scale-[0.98] rounded-sm px-6 py-3 text-xs uppercase tracking-widest font-medium transition-all shadow-xs gap-2"
            >
              <BookMarked className="h-4 w-4" />
              <span>Browse Books</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link href="/add-book" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-white/30 bg-white/5 text-[#F7F4ED] hover:bg-white/15 hover:text-white active:scale-[0.98] rounded-sm px-6 py-3 text-xs uppercase tracking-widest font-medium transition-all"
            >
              Share a Title
            </Button>
          </Link>
        </div>

        {/* Feature points */}
        <div className="pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-light text-[#EAE2D5]/80">
          <div>
            <span className="block font-serif text-lg text-[#F7F4ED]">100% Free</span>
            <span className="text-[11px] text-[#EAE2D5]/65">Member Borrowing</span>
          </div>
          <div>
            <span className="block font-serif text-lg text-[#F7F4ED]">5 Shelves</span>
            <span className="text-[11px] text-[#EAE2D5]/65">Curated Categories</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="block font-serif text-lg text-[#F7F4ED]">Reader-Owned</span>
            <span className="text-[11px] text-[#EAE2D5]/65">Community Shared</span>
          </div>
        </div>
      </div>
    </section>
  );
}

