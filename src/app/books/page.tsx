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
      <div className="flex flex-col justify-between gap-4 border-b border-stone-200 pb-6 sm:flex-row sm:items-end">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C86244]">
            Library Collection
          </span>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#1C3F3A] sm:text-4xl">
            All Books
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Browse our complete community shelf, explore diverse genres, and check out available copies.
          </p>
        </div>

        {!loading && !error && (
          <div className="text-sm font-medium text-stone-500">
            Total Available:{" "}
            <span className="font-semibold text-stone-900">{books.length}</span>{" "}
            {books.length === 1 ? "book" : "books"}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="mr-2 flex items-center gap-1.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">
          <Filter className="h-3.5 w-3.5 text-stone-400" />
          <span>Categories:</span>
        </div>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-[#1C3F3A] text-white shadow-xs"
                  : "bg-white text-stone-600 border border-stone-300 hover:bg-stone-100 hover:text-stone-900"
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
        <div className="flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white p-12 text-center shadow-xs">
          <BookOpen className="h-12 w-12 text-stone-300" />
          <h3 className="mt-4 font-serif text-lg font-semibold text-stone-800">
            Failed to load books
          </h3>
          <p className="mt-1 max-w-md text-sm text-stone-500">{error}</p>
          <Button
            onClick={() => fetchBooks(true)}
            variant="outline"
            className="mt-6 border-stone-300 text-stone-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Connection
          </Button>
        </div>
      )}

      {!loading && !error && books.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white/50 p-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-[#1C3F3A]">
            <BookOpen className="h-7 w-7" />
          </div>
          <h3 className="mt-4 font-serif text-xl font-semibold text-stone-800">
            No Books in the Library
          </h3>
          <p className="mt-1 max-w-sm text-sm text-stone-500">
            The catalog is currently waiting for its first book contribution.
          </p>
        </div>
      )}

      {!loading && !error && books.length > 0 && filteredBooks.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white p-12 text-center shadow-xs">
          <BookOpen className="h-10 w-10 text-stone-300" />
          <h3 className="mt-3 font-serif text-lg font-semibold text-stone-800">
            No books found in &quot;{selectedCategory}&quot;
          </h3>
          <p className="mt-1 text-sm text-stone-500">
            Try choosing a different category or view all books.
          </p>
          <Button
            onClick={() => setSelectedCategory("All Books")}
            variant="outline"
            size="sm"
            className="mt-4 border-stone-300"
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
