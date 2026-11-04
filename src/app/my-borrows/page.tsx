"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import toast from "react-hot-toast";

import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "cn";

interface BorrowRecord {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  userName: string;
  borrowDate: string;
  returnDate: string;
  createdAt?: string;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getBorrowStatus(returnDateStr: string) {
  if (!returnDateStr) {
    return {
      label: "Active",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const returnDate = new Date(returnDateStr);
  returnDate.setHours(0, 0, 0, 0);

  const diffTime = returnDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      label: "Overdue",
      className: "bg-red-50 text-red-700 border-red-200",
    };
  } else if (diffDays <= 2) {
    return {
      label: diffDays === 0 ? "Due Today" : `Due in ${diffDays}d`,
      className: "bg-amber-50 text-amber-700 border-amber-200",
    };
  } else {
    return {
      label: "Active",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  }
}

function MyBorrowsContent() {
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Return dialog state
  const [selectedBorrow, setSelectedBorrow] = useState<BorrowRecord | null>(null);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [returning, setReturning] = useState(false);

  const fetchBorrows = () => {
    setLoading(true);
    setError(null);

    fetch("/api/auth/jwt")
      .then((jwtRes) => {
        if (!jwtRes.ok) throw new Error("Authentication required");
        return jwtRes.json();
      })
      .then(({ token }) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        return fetch(`${apiUrl}/borrows`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });
      })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.message || "Failed to load borrowed books");
        }
        const records = Array.isArray(json) ? json : json.data || [];
        setBorrows(records);
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : "Unable to retrieve borrowed books";
        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    document.title = "BookNook | My Borrowed Books";
    let ignore = false;

    fetch("/api/auth/jwt")
      .then((jwtRes) => {
        if (!jwtRes.ok) throw new Error("Authentication required");
        return jwtRes.json();
      })
      .then(({ token }) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        return fetch(`${apiUrl}/borrows`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });
      })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.message || "Failed to load borrowed books");
        }
        if (!ignore) {
          const records = Array.isArray(json) ? json : json.data || [];
          setBorrows(records);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          const message =
            err instanceof Error ? err.message : "Unable to retrieve borrowed books";
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

  const handleConfirmReturn = async () => {
    if (!selectedBorrow) return;
    setReturning(true);

    try {
      const jwtRes = await fetch("/api/auth/jwt");
      if (!jwtRes.ok) {
        throw new Error("Authentication required. Please sign in again.");
      }
      const { token } = await jwtRes.json();

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/borrows/${selectedBorrow._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Failed to return book");
      }

      toast.success(`"${selectedBorrow.bookTitle}" has been returned to the library!`);

      // Remove from local list immediately
      setBorrows((prev) => prev.filter((b) => b._id !== selectedBorrow._id));
      setReturnDialogOpen(false);
      setSelectedBorrow(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to return book";
      toast.error(msg);
    } finally {
      setReturning(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#E5DED2] pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#292820] sm:text-4xl">
            My Borrowed Books
          </h1>
          <p className="mt-1 text-sm text-stone-600">
            Track your active library loans and return books when you finish reading.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          <Badge className="bg-[#292820] text-[#F7F4ED] hover:bg-[#292820] px-3 py-1 font-medium">
            {borrows.length} {borrows.length === 1 ? "Active Loan" : "Active Loans"}
          </Badge>
          <Link href="/books">
            <Button variant="outline" size="sm" className="border-[#E5DED2] text-[#292820] hover:bg-[#EAE2D5]">
              <BookOpen className="mr-1.5 h-3.5 w-3.5" />
              Browse More
            </Button>
          </Link>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-[#E5DED2] bg-white p-6 shadow-xs animate-pulse space-y-4"
        >
          <div className="h-5 w-40 rounded bg-[#EAE2D5]/70" />
          <div className="space-y-4 pt-2">
            {[1, 2, 3].map((row) => (
              <div key={row} className="flex items-center gap-4 border-b border-[#E5DED2]/50 pb-3">
                <div className="aspect-[3/4] w-12 rounded bg-[#EAE2D5]/50 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-[#EAE2D5]/60" />
                  <div className="h-3 w-1/5 rounded bg-[#EAE2D5]/40" />
                </div>
                <div className="h-4 w-24 rounded bg-[#EAE2D5]/40 hidden sm:block" />
                <div className="h-8 w-24 rounded bg-[#EAE2D5]/50" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-2xl border border-[#E5DED2] bg-white p-10 text-center shadow-xs"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 mb-2">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="mt-2 font-serif text-lg font-bold text-[#292820]">
            Unable to load borrowed books
          </h3>
          <p className="mt-1 text-sm text-stone-500 max-w-md mx-auto">{error}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              onClick={fetchBorrows}
              variant="outline"
              className="border-[#E5DED2] text-[#292820] hover:bg-[#EAE2D5] active:scale-[0.98] transition-all"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && borrows.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#E5DED2] bg-white/60 p-12 text-center shadow-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EAE2D5] text-[#987A50]">
            <BookOpen className="h-8 w-8" />
          </div>
          <h3 className="mt-4 font-serif text-2xl font-bold text-[#292820]">
            No Borrowed Books
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-stone-500">
            You don&apos;t have any active book loans. Browse our collection to borrow your next great read!
          </p>
          <div className="mt-6">
            <Link href="/books">
              <Button className="bg-[#292820] text-[#F7F4ED] hover:bg-[#987A50] transition-colors">
                Explore Book Catalog
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Borrow Records List */}
      {!loading && !error && borrows.length > 0 && (
        <>
          {/* Desktop & Tablet Table */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-[#E5DED2] bg-white shadow-xs">
            <table className="w-full text-left text-sm min-w-[640px]">
              <thead className="border-b border-[#E5DED2] bg-[#EAE2D5]/30 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">Book Details</th>
                  <th scope="col" className="px-6 py-4">Borrow Date</th>
                  <th scope="col" className="px-6 py-4">Return Date</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DED2]">
                {borrows.map((record) => {
                  const status = getBorrowStatus(record.returnDate);
                  return (
                    <tr key={record._id} className="hover:bg-[#EAE2D5]/20 transition-colors">
                      {/* Book Cover + Title */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative aspect-3/4 w-12 shrink-0 overflow-hidden rounded-md border border-[#E5DED2] bg-stone-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={record.bookImage}
                              alt={record.bookTitle}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/books/${record.bookId}`}
                              className="font-serif font-bold text-[#292820] hover:text-[#987A50] transition-colors truncate block"
                            >
                              {record.bookTitle}
                            </Link>
                            <span className="text-xs text-stone-400">ID: {record.bookId}</span>
                          </div>
                        </div>
                      </td>

                      {/* Borrow Date */}
                      <td className="px-6 py-4 text-stone-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-stone-400" />
                          <span>{formatDate(record.borrowDate)}</span>
                        </div>
                      </td>

                      {/* Return Date */}
                      <td className="px-6 py-4 text-stone-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-stone-400" />
                          <span className="font-medium text-[#292820]">
                            {formatDate(record.returnDate)}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border",
                            status.className
                          )}
                        >
                          {status.label}
                        </span>
                      </td>

                      {/* Return Button */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedBorrow(record);
                            setReturnDialogOpen(true);
                          }}
                          className="border-[#E5DED2] text-[#292820] hover:bg-[#292820] hover:text-[#F7F4ED] hover:border-[#292820] active:scale-[0.98] transition-all"
                        >
                          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                          Return Book
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-4">
            {borrows.map((record) => {
              const status = getBorrowStatus(record.returnDate);
              return (
                <div
                  key={record._id}
                  className="overflow-hidden rounded-xl border border-[#E5DED2] bg-white p-4 shadow-xs space-y-4"
                >
                  <div className="flex gap-3">
                    <div className="relative aspect-3/4 w-16 shrink-0 overflow-hidden rounded-md border border-[#E5DED2] bg-stone-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={record.bookImage}
                        alt={record.bookTitle}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/books/${record.bookId}`}
                          className="font-serif font-bold text-base text-[#292820] hover:text-[#987A50] line-clamp-2"
                        >
                          {record.bookTitle}
                        </Link>
                        <span
                          className={cn(
                            "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-semibold border",
                            status.className
                          )}
                        >
                          {status.label}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-stone-400">ID: {record.bookId}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 rounded-lg bg-[#EAE2D5]/30 p-2.5 text-xs">
                    <div>
                      <span className="block text-stone-400">Borrowed</span>
                      <span className="font-medium text-stone-700">
                        {formatDate(record.borrowDate)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-stone-400">Due Date</span>
                      <span className="font-semibold text-[#292820]">
                        {formatDate(record.returnDate)}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedBorrow(record);
                      setReturnDialogOpen(true);
                    }}
                    className="w-full bg-[#292820] text-[#F7F4ED] hover:bg-[#987A50] transition-colors"
                    size="sm"
                  >
                    <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                    Return Book
                  </Button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Custom Confirmation Return Dialog */}
      <Dialog open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Return Book</DialogTitle>
            <DialogDescription>
              Returning this book will update your borrowing history and increase the book&apos;s available copy count in the library catalog by 1.
            </DialogDescription>
          </DialogHeader>

          {selectedBorrow && (
            <div className="flex items-center gap-3 rounded-lg border border-[#E5DED2] bg-[#EAE2D5]/30 p-3 mt-1">
              <div className="relative aspect-3/4 w-12 shrink-0 overflow-hidden rounded bg-stone-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedBorrow.bookImage}
                  alt={selectedBorrow.bookTitle}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-serif text-sm font-bold text-[#292820] truncate">
                  {selectedBorrow.bookTitle}
                </h4>
                <p className="text-xs text-stone-500">
                  Borrowed on {formatDate(selectedBorrow.borrowDate)}
                </p>
                <p className="text-xs text-stone-500">
                  Scheduled return: {formatDate(selectedBorrow.returnDate)}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setReturnDialogOpen(false)}
              disabled={returning}
              className="border-[#E5DED2] text-[#292820] hover:bg-[#EAE2D5] active:scale-[0.98] transition-all"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmReturn}
              disabled={returning}
              className="bg-[#292820] text-[#F7F4ED] hover:bg-[#987A50] active:scale-[0.98] transition-all"
            >
              {returning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Returning...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Confirm Return
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function MyBorrowsPage() {
  return (
    <ProtectedRoute>
      <MyBorrowsContent />
    </ProtectedRoute>
  );
}
