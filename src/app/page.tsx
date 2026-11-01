import HeroSlider from "@/components/HeroSlider";
import NewArrivals from "@/components/NewArrivals";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-16">
      <HeroSlider />
      <NewArrivals />
    </div>
  );
}
