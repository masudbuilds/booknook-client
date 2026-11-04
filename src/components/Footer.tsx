import Link from "next/link";
import { BookMarked, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-booknook-border bg-booknook-secondary text-booknook-text">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-booknook-text text-booknook-bg">
                <BookMarked className="h-4 w-4" />
              </div>
              <span className="font-serif text-2xl tracking-tight text-booknook-text">
                BookNook
              </span>
            </Link>
            <p className="max-w-sm text-xs leading-relaxed text-booknook-text/75 font-light">
              An independent community lending library dedicated to the craft of reading, mindful borrowing, and sharing cherished literature.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-booknook-accent font-medium tracking-wider uppercase">
              <span>Curated with Care</span>
              <span>•</span>
              <span>Est. 2026</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-booknook-accent">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/"
                  className="text-booknook-text/80 hover:text-booknook-accent transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/books"
                  className="text-booknook-text/80 hover:text-booknook-accent transition-colors"
                >
                  All Books
                </Link>
              </li>
              <li>
                <Link
                  href="/add-book"
                  className="text-booknook-text/80 hover:text-booknook-accent transition-colors"
                >
                  Add a Book
                </Link>
              </li>
              <li>
                <Link
                  href="/my-books"
                  className="text-booknook-text/80 hover:text-booknook-accent transition-colors"
                >
                  My Books
                </Link>
              </li>
              <li>
                <Link
                  href="/my-borrows"
                  className="text-booknook-text/80 hover:text-booknook-accent transition-colors"
                >
                  My Borrowed Books
                </Link>
              </li>
            </ul>
          </div>

          {/* Explore Shelves */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-booknook-accent">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/books"
                  className="text-booknook-text/80 hover:text-booknook-accent transition-colors"
                >
                  Fiction & Literature
                </Link>
              </li>
              <li>
                <Link
                  href="/books"
                  className="text-booknook-text/80 hover:text-booknook-accent transition-colors"
                >
                  Science & Technology
                </Link>
              </li>
              <li>
                <Link
                  href="/books"
                  className="text-booknook-text/80 hover:text-booknook-accent transition-colors"
                >
                  History & Biographies
                </Link>
              </li>
              <li>
                <Link
                  href="/books"
                  className="text-booknook-text/80 hover:text-booknook-accent transition-colors"
                >
                  Kids & Illustrated
                </Link>
              </li>
              <li>
                <Link
                  href="/books"
                  className="text-booknook-text/80 hover:text-booknook-accent transition-colors"
                >
                  Art, Essays & Others
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-booknook-accent">
              Contact & Hours
            </h4>
            <ul className="space-y-2.5 text-xs text-booknook-text/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-booknook-accent shrink-0 mt-0.5" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-booknook-accent shrink-0" />
                <span>help@booknook.org</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-booknook-accent shrink-0" />
                <span>+8801700000000</span>
              </li>
            </ul>
            <p className="pt-2 text-[11px] text-booknook-text/60 font-light">
              Library Reading Room: Monday through Saturday, 9:00 AM – 8:00 PM.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-booknook-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-booknook-text/60 text-center sm:text-left">
          <p>© {new Date().getFullYear()} BookNook. All rights reserved. Read, borrow, and inspire.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link href="/books" className="hover:text-booknook-text transition-colors">
              Library Catalog
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-booknook-text transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-booknook-text transition-colors">
              Terms of Borrowing
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
