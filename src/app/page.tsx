import HeroSlider from "@/components/HeroSlider";
import NewArrivals from "@/components/NewArrivals";
import HowItWorks from "@/components/HowItWorks";
import FeaturedCategories from "@/components/FeaturedCategories";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-20">
      <HeroSlider />
      <NewArrivals />
      <HowItWorks />
      <FeaturedCategories />
    </div>
  );
}
