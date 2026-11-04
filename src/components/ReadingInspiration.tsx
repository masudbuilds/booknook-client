import Link from "next/link";
import { ArrowRight, BookOpen, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReadingInspiration() {
  return (
    <section className="overflow-hidden rounded-sm border border-booknook-primary bg-white shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
        {/* Editorial Image */}
        <div className="relative md:col-span-5 min-h-80 sm:min-h-96 md:min-h-full overflow-hidden bg-booknook-primary/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80"
            alt="Person reading an open book in a quiet room"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-t from-booknook-primary/30 to-transparent" />
        </div>

        {/* Content Side */}
        <div className="md:col-span-7 flex flex-col justify-center p-6 sm:p-10 lg:p-16 space-y-5 sm:space-y-6 bg-booknook-primary/60">
          <div className="flex items-center gap-2">
            <Quote className="h-5 w-5 text-booknook-accent" />
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-booknook-accent">
              Reading Inspiration
            </span>
          </div>

          <blockquote className="font-serif text-xl sm:text-3xl lg:text-4xl text-booknook-bg font-normal leading-snug tracking-tight">
            &ldquo;In the quiet pages of a book, you find not only the world, but yourself.&rdquo;
          </blockquote>

          <p className="text-xs sm:text-sm text-booknook-secondary/75 font-light leading-relaxed max-w-xl">
            BookNook was created as a gentle antidote to digital rush. We believe every book deserves a thoughtful reader, and every reader deserves a quiet place to escape into great stories. Borrow a title today and rediscover the timeless rhythm of turning pages.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <Link href="/books" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-booknook-bg text-booknook-secondary hover:bg-booknook-accent/90 active:scale-[0.98] rounded-sm px-6 py-2.5 text-xs uppercase tracking-widest font-medium transition-all shadow-xs gap-2"
              >
                <BookOpen className="h-4 w-4" />
                <span>Browse Books</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <span className="text-xs text-booknook-secondary/50 font-light italic">
              Free to borrow anytime
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

