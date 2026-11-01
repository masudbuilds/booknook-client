"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, RefreshCw, Sparkles } from "lucide-react";
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
      <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#1C3F3A] border border-emerald-200">
            <Sparkles className="h-3.5 w-3.5 text-[#C86244]" />
            <span>Fresh Off The Shelves</span>
          </div>
          <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-[#1C3F3A] sm:text-3xl">
            New Arrivals
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            Browse the newest additions shared by readers in our community.
          </p>
        </div>

        <Link href="/books" className="hidden sm:block">
          <Button
            variant="outline"
            className="border-stone-300 text-stone-700 hover:border-[#1C3F3A] hover:bg-[#1C3F3A]/5 hover:text-[#1C3F3A]"
          >
            <span>See All Books</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="flex h-full animate-pulse flex-col overflow-hidden rounded-xl border border-stone-200 bg-white"
            >
              <div className="aspect-3/4 w-full bg-stone-200" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 rounded bg-stone-200" />
                <div className="h-3 w-1/2 rounded bg-stone-200" />
                <div className="mt-4 h-8 w-full rounded bg-stone-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-xs">
          <BookOpen className="h-10 w-10 text-stone-300" />
          <h3 className="mt-3 font-serif text-lg font-semibold text-stone-800">
            Could not load new arrivals
          </h3>
          <p className="mt-1 max-w-sm text-sm text-stone-500">{error}</p>
          <Button
            onClick={() => fetchBooks(true)}
            variant="outline"
            size="sm"
            className="mt-4 border-stone-300 text-stone-700"
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Try Again
          </Button>
        </div>
      )}

      {!loading && !error && books.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white/50 p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-[#1C3F3A]">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-serif text-lg font-semibold text-stone-800">
            No books found
          </h3>
          <p className="mt-1 max-w-sm text-sm text-stone-500">
            Our shelves are currently empty. Sign in to contribute the first book to BookNook!
          </p>
        </div>
      )}

      {!loading && !error && books.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book._id || book.id} book={book} />
          ))}
        </div>
      )}

      <div className="flex justify-center pt-2 sm:hidden">
        <Link href="/books" className="w-full">
          <Button
            variant="outline"
            className="w-full border-stone-300 text-stone-700"
          >
            <span>See All Books</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
