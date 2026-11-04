import { BookmarkCheck, RotateCcw, Search } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Discover Your Book",
    description:
      "Explore the library catalog by title, author, or category. Inspect live copy availability before choosing your next read.",
    icon: Search,
    color: "bg-booknook-secondary/50 text-booknook-text border-booknook-border",
  },
  {
    step: "02",
    title: "Borrow In One Click",
    description:
      "Select your planned return date and confirm your borrow. An available copy is instantly reserved and added to your shelf.",
    icon: BookmarkCheck,
    color: "bg-booknook-secondary/50 text-booknook-accent border-booknook-border",
  },
  {
    step: "03",
    title: "Read & Return",
    description:
      "Enjoy reading at your leisure. When you are done, return the book with a single click so other community readers can enjoy it.",
    icon: RotateCcw,
    color: "bg-booknook-secondary/50 text-booknook-text border-booknook-border",
  },
];

export default function HowItWorks() {
  return (
    <section className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-booknook-secondary px-3 py-1 text-xs font-semibold text-booknook-accent border border-booknook-border">
          <span>Simple Process</span>
        </div>
        <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-booknook-text sm:text-3xl">
          How Borrowing Works
        </h2>
        <p className="mt-1 max-w-xl mx-auto text-sm text-booknook-text/70">
          Borrowing at BookNook is designed to be free, simple, and neighborly.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="relative flex flex-col rounded-xl border border-booknook-border bg-booknook-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border ${item.color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <span className="font-serif text-2xl font-bold text-booknook-border">
                  {item.step}
                </span>
              </div>

              <h3 className="mt-5 font-serif text-lg font-bold text-booknook-text">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-booknook-text/70">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

