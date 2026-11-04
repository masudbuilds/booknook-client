"use client";

import { useEffect, useState } from "react";
import { BookOpen, Filter, RefreshCw } from "lucide-react";
import BookCard, { Book } from "@/components/BookCard";
import { Button } from "@/components/ui/button";

const categories = [
  "All Books",
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

export default function AllBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All Books");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = (isRetry = false) => {
    if (isRetry) {
      setLoading(true);
      setError(null);
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    fetch(`${apiUrl}/books`, {
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load books (Status: ${res.status})`);
        }
        return res.json();
      })
      .then((json) => {
        const list = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
            ? json
            : [];
        setBooks(list);
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
    document.title = "BookNook | All Books";
    let ignore = false;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    fetch(`${apiUrl}/books`, {
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
          const list = Array.isArray(json?.data)
            ? json.data
            : Array.isArray(json)
              ? json
              : [];
          setBooks(list);
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

  const filteredBooks =
    selectedCategory === "All Books"
      ? books
      : books.filter((b) => b.category === selectedCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col justify-between gap-4 border-b border-[#E5DED2] pb-6 sm:flex-row sm:items-end">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#987A50]">
            Library Collection
          </span>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl text-[#292820] font-normal tracking-tight">
            All Books
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#292820]/70 font-light">
            Browse our complete community shelf, explore diverse genres, and check out available copies.
          </p>
        </div>

        {!loading && !error && (
          <div className="text-xs uppercase tracking-wider text-[#292820]/60">
            Total in Catalog:{" "}
            <span className="font-semibold text-[#292820]">{books.length}</span>{" "}
            {books.length === 1 ? "book" : "books"}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="mr-2 flex items-center gap-1.5 text-xs font-semibold text-[#292820]/60 uppercase tracking-wider">
          <Filter className="h-3.5 w-3.5 text-[#987A50]" />
          <span>Genre:</span>
        </div>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              aria-pressed={isActive}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xs px-3.5 py-1.5 text-xs uppercase tracking-wider font-medium transition-all duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#987A50] focus-visible:ring-offset-1 active:scale-[0.97] ${
                isActive
                  ? "bg-[#292820] text-[#F7F4ED] shadow-xs"
                  : "bg-white text-[#292820] border border-[#E5DED2] hover:border-[#987A50] hover:text-[#987A50]"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="flex h-full animate-pulse flex-col overflow-hidden rounded-sm border border-[#E5DED2] bg-white"
            >
              <div className="aspect-[3/4] w-full bg-[#EAE2D5]/50" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-3/4 rounded bg-[#EAE2D5]/60" />
                <div className="h-3 w-1/2 rounded bg-[#EAE2D5]/40" />
                <div className="mt-4 h-8 w-full rounded bg-[#EAE2D5]/30" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div
          role="alert"
          aria-live="polite"
          className="flex flex-col items-center justify-center rounded-sm border border-[#E5DED2] bg-white p-12 text-center shadow-xs"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAE2D5]/40 text-[#987A50] mb-2">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="mt-2 font-serif text-lg font-normal text-[#292820]">
            Failed to load books
          </h3>
          <p className="mt-1 max-w-md text-xs text-[#292820]/60 font-light leading-relaxed">{error}</p>
          <Button
            onClick={() => fetchBooks(true)}
            variant="outline"
            className="mt-6 border-[#E5DED2] text-[#292820] hover:bg-[#EAE2D5] active:scale-[0.98] transition-all rounded-sm text-xs uppercase tracking-wider"
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Retry Connection
          </Button>
        </div>
      )}

      {!loading && !error && books.length === 0 && (
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center justify-center rounded-sm border border-dashed border-[#E5DED2] bg-white/60 p-16 text-center"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAE2D5]/50 text-[#987A50] mb-2">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="mt-2 font-serif text-lg font-normal text-[#292820]">
            No Books in the Library
          </h3>
          <p className="mt-1 max-w-sm text-xs text-[#292820]/60 font-light">
            The catalog is currently waiting for its first book contribution.
          </p>
        </div>
      )}

      {!loading && !error && books.length > 0 && filteredBooks.length === 0 && (
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center justify-center rounded-sm border border-[#E5DED2] bg-white p-12 text-center shadow-xs"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAE2D5]/40 text-[#987A50] mb-2">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="mt-2 font-serif text-lg font-normal text-[#292820]">
            No books found in &quot;{selectedCategory}&quot;
          </h3>
          <p className="mt-1 text-xs text-[#292820]/60 font-light">
            Try choosing a different category or view all books.
          </p>
          <Button
            onClick={() => setSelectedCategory("All Books")}
            variant="outline"
            size="sm"
            className="mt-5 border-[#E5DED2] text-[#292820] hover:bg-[#EAE2D5] active:scale-[0.98] transition-all rounded-sm text-xs uppercase tracking-wider"
          >
            Show All Books
          </Button>
        </div>
      )}

      {!loading && !error && filteredBooks.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book) => (
            <BookCard key={book._id || book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
