import HeroSection from "@/components/HeroSection";
import Features from "@/components/Features";
import NewArrivals from "@/components/NewArrivals";
import FeaturedCategories from "@/components/FeaturedCategories";
import ReadingInspiration from "@/components/ReadingInspiration";

export default function Home() {
  return (
    <div className="w-full space-y-12 sm:space-y-16 lg:space-y-20 pb-16">
      {/* 1. Full-Width Editorial Hero Slider */}
      <HeroSection />

      {/* Main Content Sections Container */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20 lg:space-y-24">
        {/* 2. Features Section */}
        <Features />

        {/* 3. New Arrivals */}
        <NewArrivals />

        {/* 4. Featured Categories */}
        <FeaturedCategories />

        {/* 5. Reading Inspiration */}
        <ReadingInspiration />
      </div>
    </div>
  );
}
