"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, RefreshCw } from "lucide-react";
import BookCard, { Book } from "@/components/BookCard";
import { Button } from "@/components/ui/button";

export default function NewArrivals() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = (isRetry = false) => {
    if (isRetry) {
      setLoading(true);
      setError(null);
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    fetch(`${apiUrl}/books?limit=6`, {
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load books (Status: ${res.status})`);
        }
        return res.json();
      })
      .then((json) => {
        const bookList = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
            ? json
            : [];
        setBooks(bookList);
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to connect to the library catalog";
        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let ignore = false;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    fetch(`${apiUrl}/books?limit=6`, {
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load books (Status: ${res.status})`);
        }
        return res.json();
      })
      .then((json) => {
        if (!ignore) {
          const bookList = Array.isArray(json?.data)
            ? json.data
            : Array.isArray(json)
              ? json
              : [];
          setBooks(bookList);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          const message =
            err instanceof Error
              ? err.message
              : "Unable to connect to the library catalog";
          setError(message);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-booknook-border pb-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-booknook-accent">
            Fresh Off The Shelves
          </span>
          <h2 className="mt-1 font-serif text-3xl sm:text-4xl text-booknook-text font-normal tracking-tight">
            New Arrivals
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-booknook-text/70 font-light">
            Discover the latest titles generously shared by our reading community.
          </p>
        </div>

        <Link
          href="/books"
          className="group inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-medium text-booknook-text hover:text-booknook-accent transition-colors pb-1 border-b border-booknook-text/40 hover:border-booknook-accent w-fit"
        >
          <span>Explore All Books</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="flex h-full animate-pulse flex-col overflow-hidden rounded-sm border border-booknook-border bg-booknook-white"
            >
              <div className="aspect-[3/4] w-full bg-booknook-secondary/50" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-3/4 rounded bg-booknook-secondary/60" />
                <div className="h-3 w-1/2 rounded bg-booknook-secondary/40" />
                <div className="mt-4 h-8 w-full rounded bg-booknook-secondary/30" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div
          role="alert"
          aria-live="polite"
          className="flex flex-col items-center justify-center rounded-sm border border-booknook-border bg-booknook-white p-12 text-center shadow-xs"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-booknook-secondary/40 text-booknook-accent mb-2">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="mt-2 font-serif text-lg font-normal text-booknook-text">
            Could not load new arrivals
          </h3>
          <p className="mt-1 max-w-sm text-xs text-booknook-text/60 font-light leading-relaxed">
            {error}
          </p>
          <Button
            onClick={() => fetchBooks(true)}
            variant="outline"
            size="sm"
            className="mt-5 border-booknook-border text-booknook-text hover:bg-booknook-secondary active:scale-[0.98] transition-all rounded-sm text-xs uppercase tracking-wider"
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && books.length === 0 && (
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center justify-center rounded-sm border border-dashed border-booknook-border bg-booknook-white/60 p-12 text-center"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-booknook-secondary/50 text-booknook-accent mb-2">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="mt-2 font-serif text-lg font-normal text-booknook-text">
            No books found
          </h3>
          <p className="mt-1 max-w-sm text-xs text-booknook-text/60 font-light leading-relaxed">
            Our catalog is currently quiet. Be the first to share a favorite title with fellow community readers!
          </p>
          <Link href="/add-book" className="mt-5">
            <Button
              size="sm"
              className="bg-booknook-text text-booknook-bg hover:bg-booknook-accent active:scale-[0.98] transition-all rounded-sm text-xs uppercase tracking-wider shadow-xs"
            >
              Share a Title
            </Button>
          </Link>
        </div>
      )}

      {/* Books Grid */}
      {!loading && !error && books.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book._id || book.id} book={book} />
          ))}
        </div>
      )}
    </section>
  );
}
