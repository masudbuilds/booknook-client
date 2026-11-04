import { BookOpen, BookmarkCheck, HeartHandshake } from "lucide-react";

const features = [
  {
    number: "01",
    title: "Stories for Everyone",
    description:
      "From enduring classics and deep historical accounts to contemporary discoveries and illustrated children's tales, our shelves are open to every curious reader.",
    icon: BookOpen,
  },
  {
    number: "02",
    title: "Your Personal Library",
    description:
      "Check out available books with a single click, track your active loans seamlessly, and contribute your favorite personal copies for fellow book lovers to enjoy.",
    icon: BookmarkCheck,
  },
  {
    number: "03",
    title: "Made for Readers",
    description:
      "An uncluttered, peaceful literary sanctuary built on neighborly trust. No hidden fees or algorithmic noise — just the pure, enduring craft of turning pages.",
    icon: HeartHandshake,
  },
];

export default function Features() {
  return (
    <section className="space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#987A50]">
          The BookNook Ethos
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#292820] font-normal tracking-tight">
          Crafted for the Love of Reading
        </h2>
        <p className="text-xs sm:text-sm text-[#292820]/70 font-light leading-relaxed">
          Three simple pillars that define how we connect readers and stories in a quiet, neighborly space.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.number}
              className="relative flex flex-col justify-between rounded-sm border border-[#E5DED2] bg-white p-6 sm:p-8 transition-all duration-300 hover:border-[#987A50] hover:-translate-y-0.5 hover:shadow-md group"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-[#E5DED2]/60">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#EAE2D5]/50 text-[#987A50] transition-colors group-hover:bg-[#292820] group-hover:text-[#F7F4ED]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-serif text-2xl font-light text-[#987A50]/40">
                    {item.number}
                  </span>
                </div>

                <h3 className="mt-6 font-serif text-xl font-normal text-[#292820] group-hover:text-[#987A50] transition-colors">
                  {item.title}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-[#292820]/70 font-light">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#E5DED2]/40 text-[10px] uppercase tracking-widest text-[#987A50] font-medium">
                Community Principle
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

