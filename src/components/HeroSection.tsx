"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { Button } from "@/components/ui/button";

import "swiper/css";

interface SlideData {
  id: number;
  eyebrow: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  image: string;
  imageAlt: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    eyebrow: "FOR THE LOVE OF READING",
    heading: "Some stories stay with you forever.",
    description:
      "From timeless classics to modern discoveries, find stories that inspire the way you think and see the world.",
    buttonText: "Browse Books",
    buttonHref: "/books",
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1920&q=80",
    imageAlt: "A reader holding a curated stack of books",
  },
  {
    id: 2,
    eyebrow: "DISCOVER YOUR NEXT READ",
    heading: "Every book opens a new world.",
    description:
      "Explore different genres, discover new authors, and find your next favorite story.",
    buttonText: "Explore Books",
    buttonHref: "/books",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1920&q=80",
    imageAlt: "A cozy reading environment with books and warm natural lighting",
  },
  {
    id: 3,
    eyebrow: "A WORLD BETWEEN PAGES",
    heading: "Find a story worth remembering.",
    description:
      "Discover books shared by readers and make reading part of your everyday life.",
    buttonText: "Discover Books",
    buttonHref: "/books",
    image:
      "https://images.unsplash.com/photo-1507842229451-9f7a177ce533?auto=format&fit=crop&w=1920&q=80",
    imageAlt: "A beautiful classical library with towering bookshelves",
  },
];

export default function HeroSection() {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      aria-label="BookNook Editorial Hero Showcase"
      className="relative w-full overflow-hidden bg-booknook-text select-none min-h-120 md:min-h-110 lg:min-h-105"
    >
      <Swiper
        modules={[Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        speed={700}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        onSwiper={setSwiper}
        onSlideChange={(s) => setActiveIndex(s.realIndex)}
        className="w-full h-full min-h-120 md:min-h-110 lg:min-h-125"
      >
        {slides.map((slide) => (
          <SwiperSlide
            key={slide.id}
            className="relative w-full h-full min-h-120 md:min-h-110 lg:min-h-125"
          >
            {/* Background Image covering the entire hero area */}
            <div className="absolute inset-0 z-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt={slide.imageAlt}
                className="h-full w-full object-cover object-right md:object-center"
              />
              {/* Elegant dark gradient overlay from left to right */}
              <div
                className="absolute inset-0 bg-linear-to-r from-booknook-text/95 via-booknook-text/80 to-booknook-text/25 sm:from-booknook-text/95 sm:via-booknook-text/75 sm:to-black/20"
                aria-hidden="true"
              />
              {/* Subtle vertical gradient to protect bottom pagination & counter */}
              <div
                className="absolute inset-0 bg-linear-to-t from-booknook-text/70 via-transparent to-transparent pointer-events-none"
                aria-hidden="true"
              />
            </div>

            {/* Content centered vertically within a max-width container */}
            <div className="relative z-10 h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center min-h-120 md:min-h-110 lg:min-h-125">
              <div className="max-w-xl md:max-w-2xl text-left space-y-2.5 sm:space-y-3 pb-8 sm:pb-6">
                {/* Eyebrow */}
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-booknook-accent font-medium">
                  {slide.eyebrow}
                </p>

                {/* Serif Heading */}
                <h1 className="font-serif text-2xl sm:text-3xl md:text-[34px] lg:text-[38px] font-normal leading-[1.18] sm:leading-[1.15] tracking-tight text-booknook-bg">
                  {slide.heading}
                </h1>

                {/* Short descriptive paragraph */}
                <p className="text-xs sm:text-sm text-booknook-secondary/85 font-light leading-relaxed max-w-lg line-clamp-3 sm:line-clamp-none">
                  {slide.description}
                </p>

                {/* Primary CTA button */}
                <div className="pt-1.5">
                  <Link href={slide.buttonHref}>
                    <Button
                      size="sm"
                      className="bg-booknook-accent text-booknook-secondary hover:bg-booknook-accent/90 active:scale-[0.98] rounded-xs px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs uppercase tracking-widest font-medium transition-all shadow-xs gap-2 cursor-pointer"
                    >
                      <span>{slide.buttonText}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Bottom Controls Bar: Minimal Pagination on Left, Slide Counter on Right */}
      <div className="absolute bottom-4 sm:bottom-5 left-0 right-0 z-20 pointer-events-none">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: 3 Small Horizontal Pagination Indicators */}
          <div
            role="tablist"
            aria-label="Carousel pagination"
            className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto"
          >
            {slides.map((_, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={() => swiper?.slideToLoop(idx)}
                  className={`h-[2.5px] rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "w-8 sm:w-10 bg-booknook-bg"
                      : "w-3 sm:w-4 bg-booknook-bg/35 hover:bg-booknook-bg/65"
                  }`}
                />
              );
            })}
          </div>

          {/* Right: Slide Counter (01  ─────  03) */}
          <div
            className="flex items-center gap-2 sm:gap-3 text-xs sm:text-[13px] font-mono tracking-widest text-booknook-bg/80 pointer-events-auto select-none"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="font-medium text-booknook-bg">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span
              className="inline-block w-8 sm:w-12 h-px bg-booknook-bg/40"
              aria-hidden="true"
            />
            <span className="text-booknook-bg/60">03</span>
          </div>
        </div>
      </div>
    </section>
  );
}
