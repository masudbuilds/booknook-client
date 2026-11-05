import Link from "next/link";
import { BookMarked, Mail, MapPin, Phone } from "lucide-react";

function XLogo({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookLogo({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function InstagramLogo({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function GithubLogo({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

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

            {/* Social Links */}
            <div className="pt-2 flex items-center gap-2.5">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow BookNook on X"
                className="flex h-8 w-8 items-center justify-center rounded-xs border border-booknook-border bg-booknook-bg/60 text-booknook-text/70 transition-colors hover:border-booknook-accent hover:text-booknook-accent hover:bg-booknook-white"
              >
                <XLogo className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow BookNook on Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-xs border border-booknook-border bg-booknook-bg/60 text-booknook-text/70 transition-colors hover:border-booknook-accent hover:text-booknook-accent hover:bg-booknook-white"
              >
                <FacebookLogo className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow BookNook on Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-xs border border-booknook-border bg-booknook-bg/60 text-booknook-text/70 transition-colors hover:border-booknook-accent hover:text-booknook-accent hover:bg-booknook-white"
              >
                <InstagramLogo className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://github.com/masudbuilds/booknook-client"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="BookNook GitHub Repository"
                className="flex h-8 w-8 items-center justify-center rounded-xs border border-booknook-border bg-booknook-bg/60 text-booknook-text/70 transition-colors hover:border-booknook-accent hover:text-booknook-accent hover:bg-booknook-white"
              >
                <GithubLogo className="h-3.5 w-3.5" />
              </a>
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
                <span>+8801800000000</span>
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
