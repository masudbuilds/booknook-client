"use client";

import Link from "next/link";
import { BookOpen, ArrowRight, Sparkles, BookmarkCheck } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Button } from "@/components/ui/button";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface SlideData {
  id: number;
  badge: string;
  title: string;
  description: string;
  accent: string;
  bgGradient: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    badge: "Community Catalog",
    title: "Discover Your Next Great Literary Journey",
    description:
      "Explore a curated shelf of community-shared books. From timeless classics to fresh contemporary releases, your next favorite story is waiting.",
    accent: "#C86244",
    bgGradient: "from-[#1C3F3A] to-[#122A26]",
  },
  {
    id: 2,
    badge: "Effortless Borrowing",
    title: "Borrow for Free, Read at Your Own Leisure",
    description:
      "Check out available titles with a single click. Keep track of your due dates and return books smoothly whenever you finish.",
    accent: "#E28743",
    bgGradient: "from-[#234E45] to-[#16332D]",
  },
  {
    id: 3,
    badge: "Reader Community",
    title: "Share Beloved Stories with Fellow Readers",
    description:
      "Have a book that touched your heart? Add it to the BookNook library so another reader in the community can experience the magic.",
    accent: "#8FBC8F",
    bgGradient: "from-[#1A3732] to-[#0E201D]",
  },
];

export default function HeroSlider() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-md">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 5500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletActiveClass: "!bg-amber-400 !w-8 !rounded-full transition-all duration-300",
          bulletClass: "inline-block h-2 w-2 rounded-full bg-white/50 mx-1 cursor-pointer transition-all duration-300",
        }}
        navigation={true}
        loop={true}
        className="booknook-hero-swiper h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className={`relative flex min-h-[420px] flex-col justify-center bg-gradient-to-br ${slide.bgGradient} px-6 py-16 text-white sm:min-h-[480px] sm:px-12 md:min-h-[520px] md:px-20`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

              <div className="relative z-10 max-w-2xl space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium tracking-wide text-amber-200 backdrop-blur-sm border border-white/15">
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>{slide.badge}</span>
                </div>

                <h1 className="font-serif text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-amber-50">
                  {slide.title}
                </h1>

                <p className="text-sm leading-relaxed text-stone-200 sm:text-base md:text-lg">
                  {slide.description}
                </p>

                <div className="pt-2">
                  <Link href="/books">
                    <Button
                      size="lg"
                      className="group bg-[#C86244] text-white hover:bg-[#B35338] shadow-md transition-all duration-200"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Browse Books
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="absolute right-8 bottom-8 hidden opacity-15 lg:block pointer-events-none">
                <BookmarkCheck className="h-64 w-64 text-white" />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

