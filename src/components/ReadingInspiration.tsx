import Link from "next/link";
import { ArrowRight, BookOpen, Quote, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReadingInspiration() {
  return (
    <section
      aria-label="Reading Inspiration and Library Ethos"
      className="relative overflow-hidden rounded-xs border border-[#E5DED2] bg-[#292820] text-[#F7F4ED] shadow-sm"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left: Editorial Narrative & Values (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-14 space-y-6 sm:space-y-8">
          <div className="space-y-4 sm:space-y-5">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-xs bg-[#987A50]/15 px-3 py-1 text-[10px] sm:text-[11px] font-medium tracking-[0.25em] text-[#987A50] border border-[#987A50]/30 uppercase">
              <Quote className="h-3 w-3 text-[#987A50]" />
              <span>The Reader&apos;s Sanctuary</span>
            </div>

            {/* Prominent Serif Quote */}
            <blockquote className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-normal leading-[1.2] tracking-tight text-[#F7F4ED]">
              &ldquo;In the quiet pages of a book, you find not only the world, but yourself.&rdquo;
            </blockquote>

            <cite className="block text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#987A50] font-sans not-italic font-medium">
              — A BookNook Reflection
            </cite>

            {/* Narrative Paragraph */}
            <p className="text-xs sm:text-sm text-[#EAE2D5]/80 font-light leading-relaxed max-w-xl">
              BookNook was created as a gentle antidote to digital rush. We believe every book deserves a thoughtful reader, and every reader deserves a quiet place to escape into great stories. Borrow a title today and rediscover the timeless rhythm of turning pages.
            </p>
          </div>

          {/* Three Value Pillars */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-3 sm:gap-4 text-left">
            <div>
              <span className="block font-serif text-base sm:text-lg text-[#F7F4ED] font-normal">
                100% Free
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#EAE2D5]/60 font-light block">
                Community Lending
              </span>
            </div>
            <div>
              <span className="block font-serif text-base sm:text-lg text-[#F7F4ED] font-normal">
                Zero Rush
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#EAE2D5]/60 font-light block">
                Mindful Due Dates
              </span>
            </div>
            <div>
              <span className="block font-serif text-base sm:text-lg text-[#F7F4ED] font-normal">
                Open Shelves
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#EAE2D5]/60 font-light block">
                Reader Contributed
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link href="/books" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-[#987A50] text-[#F7F4ED] hover:bg-[#856942] active:scale-[0.98] rounded-xs px-6 py-3 text-xs uppercase tracking-widest font-medium transition-all shadow-xs gap-2 cursor-pointer"
              >
                <BookOpen className="h-4 w-4" />
                <span>Browse The Library</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>

            <Link
              href="/add-book"
              className="text-xs uppercase tracking-widest font-medium text-[#EAE2D5] hover:text-[#987A50] transition-colors pb-1 border-b border-[#EAE2D5]/30 hover:border-[#987A50] inline-flex items-center gap-1.5 self-center sm:self-auto cursor-pointer"
            >
              <span>Share A Personal Title</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Right: Atmospheric Image & Floating Quote Card (5 cols) */}
        <div className="relative lg:col-span-5 min-h-[300px] sm:min-h-[380px] lg:min-h-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80"
            alt="Open hardcover book on a wooden reading desk"
            className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
          />

          {/* Gradients blending with the dark background */}
          <div
            className="absolute inset-0 bg-linear-to-t from-[#292820] via-[#292820]/30 to-transparent lg:bg-linear-to-r lg:from-[#292820] lg:via-transparent lg:to-transparent"
            aria-hidden="true"
          />

          {/* Top-Right Curated Pill */}
          <div className="absolute top-4 right-4 rounded-xs bg-[#987A50] text-[#F7F4ED] px-3 py-1 text-[9px] uppercase tracking-[0.25em] font-semibold shadow-md">
            Curated Shelf
          </div>

          {/* Bottom Floating Literary Quote Card */}
          <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6 rounded-xs bg-[#292820]/85 backdrop-blur-md border border-white/15 p-4 sm:p-5 text-left shadow-lg">
            <div className="flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 text-[#987A50] shrink-0 mt-0.5" />
              <div>
                <p className="font-serif text-xs sm:text-sm italic text-[#F7F4ED] leading-snug">
                  &ldquo;A room without books is like a body without a soul.&rdquo;
                </p>
                <span className="mt-1.5 block text-[10px] uppercase tracking-[0.2em] text-[#987A50] font-medium">
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
