"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Layers,
  Loader2,
  RefreshCw,
  User,
} from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface BookDetail {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  userEmail: string;
  userName: string;
  createdAt: string;
}

function BookDetailsContent() {
  const params = useParams();
  const id = params?.id as string;

  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookDetails = () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    fetch("/api/auth/jwt")
      .then((jwtRes) => {
        if (!jwtRes.ok) throw new Error("Authentication required");
        return jwtRes.json();
      })
      .then(({ token }) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        return fetch(`${apiUrl}/books/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });
      })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.message || "Failed to load book details");
        }
        setBook(json.data || json);
        document.title = `BookNook | ${json.data?.title || json?.title || "Book Details"}`;
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : "Unable to retrieve book details";
        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let ignore = false;
    if (!id) return;

    fetch("/api/auth/jwt")
      .then((jwtRes) => {
        if (!jwtRes.ok) throw new Error("Authentication required");
        return jwtRes.json();
      })
      .then(({ token }) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        return fetch(`${apiUrl}/books/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });
      })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.message || "Failed to load book details");
        }
        if (!ignore) {
          const loadedBook = json.data || json;
          setBook(loadedBook);
          document.title = `BookNook | ${loadedBook.title || "Book Details"}`;
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          const message =
            err instanceof Error ? err.message : "Unable to retrieve book details";
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
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#1C3F3A]" />
        <p className="text-sm text-stone-500">Loading book details...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="rounded-2xl border border-stone-200 bg-white p-12 shadow-xs">
          <BookOpen className="mx-auto h-12 w-12 text-stone-300" />
          <h2 className="mt-4 font-serif text-2xl font-bold text-stone-800">
            Book Not Found
          </h2>
          <p className="mt-2 text-sm text-stone-500">
            {error || "The book you are looking for does not exist or has been removed."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={fetchBookDetails}
              className="border-stone-300"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Link href="/books">
              <Button className="bg-[#1C3F3A] text-white hover:bg-[#15302C]">
                Back to All Books
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isAvailable = book.availableCopies > 0;
  const formattedDate = book.createdAt
    ? new Date(book.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently added";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div>
        <Link
          href="/books"
          className="inline-flex items-center text-sm font-medium text-stone-600 hover:text-[#1C3F3A] transition-colors"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to Books
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-12 items-start">
        <div className="md:col-span-5">
          <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white p-3 shadow-md">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={book.image}
                alt={book.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-semibold px-3 py-1">
                {book.category}
              </Badge>
              <span
                className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                  isAvailable
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {isAvailable ? `${book.availableCopies} Copies Available` : "Not Available"}
              </span>
            </div>

            <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl leading-tight">
              {book.title}
            </h1>

            <div className="flex items-center gap-2 text-stone-600">
              <User className="h-4 w-4 text-stone-400" />
              <span className="text-base font-medium">By {book.author}</span>
            </div>
          </div>

          <Card className="border-stone-200 bg-white shadow-xs">
            <CardContent className="p-4 space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="flex items-center gap-1.5 text-stone-500">
                  <Layers className="h-4 w-4 text-stone-400" />
                  Total Copies in Library
                </span>
                <span className="font-semibold text-stone-900">{book.totalCopies}</span>
              </div>
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="flex items-center gap-1.5 text-stone-500">
                  <Calendar className="h-4 w-4 text-stone-400" />
                  Added to Catalog
                </span>
                <span className="font-semibold text-stone-900">{formattedDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-stone-500">
                  <User className="h-4 w-4 text-stone-400" />
                  Contributed By
                </span>
                <span className="font-semibold text-stone-900">{book.userName || "Community Reader"}</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-[#1C3F3A]">Synopsis & Description</h3>
            <p className="whitespace-pre-line text-sm leading-relaxed text-stone-600">
              {book.description}
            </p>
          </div>

          <div className="pt-4 border-t border-stone-200">
            <Button
              disabled={true}
              size="lg"
              className="w-full sm:w-auto bg-[#1C3F3A] text-white opacity-70 cursor-not-allowed"
              title="Borrowing feature will be available in Phase 5"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              {isAvailable ? "Borrow This Book (Phase 5)" : "Not Available"}
            </Button>
            <p className="mt-2 text-xs text-stone-500">
              The borrowing checkout workflow will be enabled in Phase 5.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookDetailsPage() {
  return (
    <ProtectedRoute>
      <BookDetailsContent />
    </ProtectedRoute>
  );
}

