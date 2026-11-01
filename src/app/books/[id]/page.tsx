"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Calendar,
  Layers,
  Loader2,
  RefreshCw,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "cn";

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
  const { data: session } = useSession();

  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Borrow modal states
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [returnDate, setReturnDate] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);
  const [borrowing, setBorrowing] = useState(false);

  // Dates
  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minReturnDate = tomorrow.toISOString().split("T")[0];

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

  const handleConfirmBorrow = async () => {
    if (!book) return;

    if (!returnDate) {
      setDateError("Please select a return date.");
      return;
    }

    const borrowTime = new Date(todayStr).getTime();
    const returnTime = new Date(returnDate).getTime();

    if (isNaN(returnTime)) {
      setDateError("Please enter a valid return date.");
      return;
    }

    if (returnTime <= borrowTime) {
      setDateError("Return date must be later than the borrow date.");
      return;
    }

    setDateError(null);
    setBorrowing(true);

    try {
      const jwtRes = await fetch("/api/auth/jwt");
      if (!jwtRes.ok) {
        throw new Error("Authentication required. Please sign in again.");
      }
      const { token } = await jwtRes.json();

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/borrows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookId: book._id,
          bookTitle: book.title,
          bookImage: book.image,
          borrowDate: todayStr,
          returnDate,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to borrow book");
      }

      toast.success(`You have borrowed "${book.title}" successfully!`);

      // Decrement available copies immediately in state without reloading
      setBook((prev) =>
        prev
          ? {
              ...prev,
              availableCopies: Math.max(0, prev.availableCopies - 1),
            }
          : null
      );

      setBorrowModalOpen(false);
      setReturnDate("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to borrow book";
      toast.error(msg);
      // Keep modal open so the user can fix the issue or retry
    } finally {
      setBorrowing(false);
    }
  };

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

  const borrowerName = session?.user?.name || "Library Member";
  const borrowerEmail = session?.user?.email || "";

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
            <div className="relative aspect-3/4 w-full overflow-hidden rounded-xl bg-stone-100">
              {!imageError && book.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={book.image}
                  alt={book.title}
                  onError={() => setImageError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-stone-100 p-6 text-stone-400">
                  <BookOpen className="h-12 w-12 text-stone-300" />
                  <span className="text-xs font-medium text-stone-400">No cover image available</span>
                </div>
              )}
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
                className={cn(
                  "rounded-full px-3 py-0.5 text-xs font-semibold",
                  isAvailable
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                )}
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
                <span className="font-semibold text-stone-900">
                  {book.userName || "Community Reader"}
                </span>
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
              onClick={() => {
                setDateError(null);
                setReturnDate("");
                setBorrowModalOpen(true);
              }}
              disabled={!isAvailable || borrowing}
              size="lg"
              className={cn(
                "w-full sm:w-auto font-medium transition-all shadow-xs",
                isAvailable
                  ? "bg-[#1C3F3A] text-white hover:bg-[#15302C]"
                  : "bg-stone-200 text-stone-500 cursor-not-allowed hover:bg-stone-200"
              )}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              {isAvailable ? "Borrow This Book" : "Not Available"}
            </Button>
            <p className="mt-2 text-xs text-stone-500">
              {isAvailable
                ? "Borrowing is free for all registered library members. Select a return date to proceed."
                : "All copies of this book are currently on loan. Please check back later."}
            </p>
          </div>
        </div>
      </div>

      {/* Borrow Book Modal */}
      <Dialog open={borrowModalOpen} onOpenChange={setBorrowModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Borrow Book</DialogTitle>
            <DialogDescription>
              Confirm your borrowing request for this library book.
            </DialogDescription>
          </DialogHeader>

          {/* Book Summary Card */}
          <div className="flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50/80 p-3">
            <div className="relative aspect-3/4 w-12 shrink-0 overflow-hidden rounded bg-stone-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={book.image}
                alt={book.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-serif text-sm font-bold text-stone-900 truncate">
                {book.title}
              </h4>
              <p className="text-xs text-stone-500 truncate">By {book.author}</p>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-stone-300">
                  {book.category}
                </Badge>
                <span className="text-[11px] font-medium text-emerald-700">
                  {book.availableCopies} available
                </span>
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleConfirmBorrow();
            }}
            className="space-y-4 pt-1"
          >
            {/* Read-only User Name */}
            <div className="space-y-1.5">
              <Label htmlFor="borrowerName" className="text-xs font-semibold text-stone-700">
                Borrower Name
              </Label>
              <Input
                id="borrowerName"
                value={borrowerName}
                readOnly
                disabled
                className="bg-stone-100 text-stone-600 cursor-not-allowed border-stone-200 text-sm"
              />
            </div>

            {/* Read-only User Email */}
            <div className="space-y-1.5">
              <Label htmlFor="borrowerEmail" className="text-xs font-semibold text-stone-700">
                Borrower Email
              </Label>
              <Input
                id="borrowerEmail"
                value={borrowerEmail}
                readOnly
                disabled
                className="bg-stone-100 text-stone-600 cursor-not-allowed border-stone-200 text-sm"
              />
            </div>

            {/* Read-only Borrow Date */}
            <div className="space-y-1.5">
              <Label htmlFor="borrowDate" className="text-xs font-semibold text-stone-700">
                Borrow Date
              </Label>
              <Input
                id="borrowDate"
                type="date"
                value={todayStr}
                readOnly
                disabled
                className="bg-stone-100 text-stone-600 cursor-not-allowed border-stone-200 text-sm"
              />
            </div>

            {/* Select Return Date */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="returnDate" className="text-xs font-semibold text-stone-700">
                  Return Date <span className="text-red-500">*</span>
                </Label>
                <span className="text-[11px] text-stone-400">Must be after today</span>
              </div>
              <Input
                id="returnDate"
                type="date"
                min={minReturnDate}
                value={returnDate}
                onChange={(e) => {
                  setReturnDate(e.target.value);
                  if (dateError) setDateError(null);
                }}
                className={cn(
                  "border-stone-300 focus-visible:ring-[#1C3F3A] text-sm",
                  dateError && "border-red-500 focus-visible:ring-red-500"
                )}
                required
              />
              {dateError && (
                <p className="flex items-center gap-1 text-xs font-medium text-red-600 mt-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {dateError}
                </p>
              )}
            </div>

            <DialogFooter className="mt-6 gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setBorrowModalOpen(false)}
                disabled={borrowing}
                className="border-stone-300 text-stone-700 hover:bg-stone-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={borrowing}
                className="bg-[#1C3F3A] text-white hover:bg-[#15302C]"
              >
                {borrowing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Borrowing...
                  </>
                ) : (
                  "Confirm Borrow"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
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
