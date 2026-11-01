import Link from "next/link";
import { BookOpen, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200/80 bg-[#F6F3EB] text-stone-700">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1C3F3A] text-amber-50">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#1C3F3A]">
                BookNook
              </span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-stone-600">
              A community library crafted for passionate readers. Discover captivating stories,
              borrow titles for your quiet reading hours, and share your personal favorites with fellow book lovers.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#1C3F3A]">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-stone-600">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#C86244] shrink-0" />
                <span>42 Library Lane, Book District</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#C86244] shrink-0" />
                <span>+1 (800) 266-5665</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#C86244] shrink-0" />
                <span>support@booknook.library</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#1C3F3A]">
              Connect
            </h3>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-200/80 text-stone-700 transition-colors hover:bg-[#1C3F3A] hover:text-white"
              >
                <svg
                  className="h-4 w-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (formerly Twitter)"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-200/80 text-stone-700 transition-colors hover:bg-[#1C3F3A] hover:text-white"
              >
                <svg
                  className="h-4 w-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
            <p className="mt-4 text-xs text-stone-500">
              Open Monday to Saturday, 9:00 AM – 8:00 PM.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-stone-200 pt-6 text-center text-xs text-stone-500">
          <p>© {new Date().getFullYear()} BookNook. All rights reserved. Read, borrow, and inspire.</p>
        </div>
      </div>
    </footer>
  );
}
