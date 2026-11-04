import Link from "next/link";
import { ArrowRight, BookOpen, Quote, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReadingInspiration() {
  return (
    <section
      aria-label="Reading Inspiration and Library Ethos"
      className="relative overflow-hidden rounded-xs border border-booknook-border bg-booknook-text text-booknook-bg shadow-sm"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left: Editorial Narrative & Values (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-14 space-y-6 sm:space-y-8">
          <div className="space-y-4 sm:space-y-5">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-xs bg-booknook-accent/15 px-3 py-1 text-[10px] sm:text-[11px] font-medium tracking-[0.25em] text-booknook-accent border border-booknook-accent/30 uppercase">
              <Quote className="h-3 w-3 text-booknook-accent" />
              <span>The Reader&apos;s Sanctuary</span>
            </div>

            {/* Prominent Serif Quote */}
            <blockquote className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-normal leading-[1.2] tracking-tight text-booknook-bg">
              &ldquo;In the quiet pages of a book, you find not only the world, but yourself.&rdquo;
            </blockquote>

            <cite className="block text-[11px] sm:text-xs uppercase tracking-[0.22em] text-booknook-accent font-sans not-italic font-medium">
              — A BookNook Reflection
            </cite>

            {/* Narrative Paragraph */}
            <p className="text-xs sm:text-sm text-booknook-secondary/80 font-light leading-relaxed max-w-xl">
              BookNook was created as a gentle antidote to digital rush. We believe every book deserves a thoughtful reader, and every reader deserves a quiet place to escape into great stories. Borrow a title today and rediscover the timeless rhythm of turning pages.
            </p>
          </div>

          {/* Three Value Pillars */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-3 sm:gap-4 text-left">
            <div>
              <span className="block font-serif text-base sm:text-lg text-booknook-bg font-normal">
                100% Free
              </span>
              <span className="text-[10px] sm:text-[11px] text-booknook-secondary/60 font-light block">
                Community Lending
              </span>
            </div>
            <div>
              <span className="block font-serif text-base sm:text-lg text-booknook-bg font-normal">
                Zero Rush
              </span>
              <span className="text-[10px] sm:text-[11px] text-booknook-secondary/60 font-light block">
                Mindful Due Dates
              </span>
            </div>
            <div>
              <span className="block font-serif text-base sm:text-lg text-booknook-bg font-normal">
                Open Shelves
              </span>
              <span className="text-[10px] sm:text-[11px] text-booknook-secondary/60 font-light block">
                Reader Contributed
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link href="/books" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-booknook-accent text-booknook-bg hover:bg-booknook-accent/90 active:scale-[0.98] rounded-xs px-6 py-3 text-xs uppercase tracking-widest font-medium transition-all shadow-xs gap-2 cursor-pointer"
              >
                <BookOpen className="h-4 w-4" />
                <span>Browse The Library</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>

            <Link
              href="/add-book"
              className="text-xs uppercase tracking-widest font-medium text-booknook-secondary hover:text-booknook-accent transition-colors pb-1 border-b border-booknook-secondary/30 hover:border-booknook-accent inline-flex items-center gap-1.5 self-center sm:self-auto cursor-pointer"
            >
              <span>Share A Personal Title</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Right: Atmospheric Image & Floating Quote Card (5 cols) */}
        <div className="relative lg:col-span-5 min-h-75 sm:min-h-95 lg:min-h-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80"
            alt="Open hardcover book on a wooden reading desk"
            className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
          />

          {/* Gradients blending with the dark background */}
          <div
            className="absolute inset-0 bg-linear-to-t from-booknook-text via-booknook-text/30 to-transparent lg:bg-linear-to-r lg:from-booknook-text lg:via-transparent lg:to-transparent"
            aria-hidden="true"
          />

          {/* Top-Right Curated Pill */}
          <div className="absolute top-4 right-4 rounded-xs bg-booknook-accent text-booknook-bg px-3 py-1 text-[9px] uppercase tracking-[0.25em] font-semibold shadow-md">
            Curated Shelf
          </div>

          {/* Bottom Floating Literary Quote Card */}
          <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6 rounded-xs bg-booknook-text/85 backdrop-blur-md border border-white/15 p-4 sm:p-5 text-left shadow-lg">
            <div className="flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 text-booknook-accent shrink-0 mt-0.5" />
              <div>
                <p className="font-serif text-xs sm:text-sm italic text-booknook-bg leading-snug">
                  &ldquo;A room without books is like a body without a soul.&rdquo;
                </p>
                <span className="mt-1.5 block text-[10px] uppercase tracking-[0.2em] text-booknook-accent font-medium">
                  Marcus Tullius Cicero
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
