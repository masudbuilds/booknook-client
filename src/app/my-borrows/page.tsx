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
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
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
      label: "Active Loan",
      className: "bg-emerald-50 text-emerald-800 border-emerald-200",
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
      className: "bg-red-50 text-red-800 border-red-200",
    };
  } else if (diffDays <= 2) {
    return {
      label: diffDays === 0 ? "Due Today" : `Due in ${diffDays}d`,
      className: "bg-amber-50 text-amber-800 border-amber-200",
    };
  } else {
    return {
      label: "Active Loan",
      className: "bg-emerald-50 text-emerald-800 border-emerald-200",
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
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 border-b border-booknook-border pb-6 sm:pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-booknook-accent" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-booknook-accent">
              Personal Lending Ledger
            </span>
          </div>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl text-booknook-text font-normal tracking-tight">
            My Borrowed Books
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-booknook-text/75 font-light leading-relaxed max-w-2xl">
            Track your active library loans, review scheduled return dates, and return books to restore
            catalog copies for other readers.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          {!loading && !error && (
            <div className="inline-flex items-center gap-1.5 rounded-xs border border-booknook-border bg-booknook-white px-3 py-1.5 text-xs text-booknook-text font-medium shadow-2xs">
              <span className="text-booknook-text/60">Active Loans:</span>
              <span className="font-semibold text-booknook-accent">{borrows.length}</span>
            </div>
          )}
          <Link href="/books">
            <Button
              variant="outline"
              className="h-10 px-5 border-booknook-border bg-booknook-white text-booknook-text hover:bg-booknook-secondary active:scale-[0.98] rounded-xs text-xs uppercase tracking-widest font-medium transition-all gap-2"
            >
              <BookOpen className="h-4 w-4 text-booknook-accent" />
              <span>Browse Catalog</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xs border border-booknook-border bg-booknook-white p-6 shadow-2xs animate-pulse space-y-4"
        >
          <div className="h-4 w-40 rounded-xs bg-booknook-secondary/70" />
          <div className="space-y-4 pt-2">
            {[1, 2, 3].map((row) => (
              <div key={row} className="flex items-center gap-4 border-b border-booknook-border/50 pb-4">
                <div className="aspect-[3/4] w-12 rounded-xs bg-booknook-secondary/50 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded-xs bg-booknook-secondary/60" />
                  <div className="h-3 w-1/5 rounded-xs bg-booknook-secondary/40" />
                </div>
                <div className="h-4 w-24 rounded-xs bg-booknook-secondary/40 hidden sm:block" />
                <div className="h-8 w-24 rounded-xs bg-booknook-secondary/50" />
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
          className="rounded-xs border border-booknook-border bg-booknook-white p-12 text-center shadow-xs"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xs bg-destructive/10 text-destructive mb-3">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="font-serif text-xl font-normal text-booknook-text">
            Unable to load borrowed records
          </h3>
          <p className="mt-1 max-w-sm text-xs text-booknook-text/70 font-light mx-auto">{error}</p>
          <Button
            onClick={fetchBorrows}
            variant="outline"
            className="mt-5 border-booknook-border bg-booknook-white text-booknook-text hover:bg-booknook-secondary rounded-xs text-xs uppercase tracking-widest font-medium active:scale-[0.98] transition-all"
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5 text-booknook-accent" />
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && borrows.length === 0 && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xs border border-dashed border-booknook-border bg-booknook-white/70 p-12 sm:p-16 text-center shadow-xs"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xs bg-booknook-secondary text-booknook-accent">
            <BookOpen className="h-7 w-7" />
          </div>
          <h3 className="mt-4 font-serif text-2xl font-normal text-booknook-text">
            No Active Book Loans
          </h3>
          <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-booknook-text/70 font-light leading-relaxed">
            You do not currently hold any borrowed volumes. Explore our curated shelves to check out
            your next great read with a single click.
          </p>
          <div className="mt-6">
            <Link href="/books">
              <Button className="bg-booknook-accent text-booknook-bg hover:bg-booknook-accent/90 active:scale-[0.98] rounded-xs text-xs uppercase tracking-widest font-medium transition-all shadow-xs gap-2 cursor-pointer h-10 px-6">
                <Sparkles className="h-4 w-4" />
                <span>Explore The Library</span>
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Borrow Records List */}
      {!loading && !error && borrows.length > 0 && (
        <>
          {/* Desktop & Tablet Table (md+) */}
          <div className="hidden md:block overflow-x-auto rounded-xs border border-booknook-border bg-booknook-white shadow-2xs">
            <table className="w-full text-left text-sm min-w-[640px]">
              <thead className="border-b border-booknook-border bg-booknook-bg text-[11px] font-semibold text-booknook-text/70 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-3.5">
                    Book Details
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Borrow Date
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Scheduled Return
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-booknook-border">
                {borrows.map((record) => {
                  const status = getBorrowStatus(record.returnDate);
                  return (
                    <tr key={record._id} className="hover:bg-booknook-bg/50 transition-colors">
                      {/* Book Cover + Title */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="relative aspect-[3/4] w-12 shrink-0 overflow-hidden rounded-xs border border-booknook-border bg-booknook-secondary/30 shadow-2xs after:absolute after:inset-y-0 after:left-0 after:w-1.5 after:bg-linear-to-r after:from-black/25 after:to-transparent">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={record.bookImage}
                              alt={record.bookTitle}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <Link
                              href={`/books/${record.bookId}`}
                              className="font-serif font-normal text-base text-booknook-text hover:text-booknook-accent transition-colors truncate block"
                            >
                              {record.bookTitle}
                            </Link>
                            <span className="text-[11px] text-booknook-text/50 font-mono">
                              Catalog ID: {record.bookId}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Borrow Date */}
                      <td className="px-6 py-4 text-xs text-booknook-text/75 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-booknook-accent" />
                          <span>{formatDate(record.borrowDate)}</span>
                        </div>
                      </td>

                      {/* Return Date */}
                      <td className="px-6 py-4 text-xs text-booknook-text/75 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-booknook-accent" />
                          <span className="font-medium text-booknook-text">
                            {formatDate(record.returnDate)}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-xs px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold border",
                            status.className
                          )}
                        >
                          {status.label}
                        </span>
                      </td>

                      {/* Return Action Button */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedBorrow(record);
                            setReturnDialogOpen(true);
                          }}
                          className="h-8.5 px-3.5 border-booknook-border bg-booknook-white text-booknook-text hover:bg-booknook-text hover:text-booknook-bg hover:border-booknook-text active:scale-[0.98] rounded-xs text-[11px] uppercase tracking-wider font-medium transition-all gap-1.5"
                        >
                          <RotateCcw className="h-3 w-3 text-booknook-accent" />
                          <span>Return Book</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout (<md) */}
          <div className="md:hidden space-y-4">
            {borrows.map((record) => {
              const status = getBorrowStatus(record.returnDate);
              return (
                <div
                  key={record._id}
                  className="overflow-hidden rounded-xs border border-booknook-border bg-booknook-white p-4 shadow-2xs space-y-4"
                >
                  <div className="flex gap-3">
                    <div className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-xs border border-booknook-border bg-booknook-secondary/30 shadow-2xs after:absolute after:inset-y-0 after:left-0 after:w-1.5 after:bg-linear-to-r after:from-black/25 after:to-transparent">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={record.bookImage}
                        alt={record.bookTitle}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/books/${record.bookId}`}
                          className="font-serif font-normal text-base text-booknook-text hover:text-booknook-accent line-clamp-2"
                        >
                          {record.bookTitle}
                        </Link>
                      </div>
                      <span
                        className={cn(
                          "inline-flex shrink-0 items-center rounded-xs px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold border",
                          status.className
                        )}
                      >
                        {status.label}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 rounded-xs bg-booknook-bg border border-booknook-border p-2.5 text-xs">
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-booknook-text/60">
                        Borrowed
                      </span>
                      <span className="font-medium text-booknook-text">
                        {formatDate(record.borrowDate)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-booknook-text/60">
                        Due Date
                      </span>
                      <span className="font-semibold text-booknook-accent">
                        {formatDate(record.returnDate)}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedBorrow(record);
                      setReturnDialogOpen(true);
                    }}
                    className="w-full bg-booknook-accent text-booknook-bg hover:bg-booknook-accent/90 active:scale-[0.98] rounded-xs text-xs uppercase tracking-widest font-medium transition-all shadow-xs gap-2 h-9"
                    size="sm"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Return Book to Library</span>
                  </Button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Return Confirmation Dialog */}
      <Dialog open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
        <DialogContent className="sm:max-w-md bg-booknook-white border border-booknook-border rounded-xs p-6">
          <DialogHeader className="space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xs bg-booknook-secondary text-booknook-accent mb-1">
              <RotateCcw className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center font-serif text-2xl font-normal text-booknook-text">
              Return Book to Library
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-booknook-text/70 font-light leading-relaxed">
              Confirming this return will update your borrowing records and immediately return 1 copy
              to the community catalog for other readers to borrow.
            </DialogDescription>
          </DialogHeader>

          {selectedBorrow && (
            <div className="flex items-center gap-3.5 rounded-xs border border-booknook-border bg-booknook-bg p-3.5 mt-2">
              <div className="relative aspect-[3/4] w-12 shrink-0 overflow-hidden rounded-xs border border-booknook-border bg-booknook-white shadow-2xs after:absolute after:inset-y-0 after:left-0 after:w-1.5 after:bg-linear-to-r after:from-black/25 after:to-transparent">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedBorrow.bookImage}
                  alt={selectedBorrow.bookTitle}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <h4 className="font-serif text-sm font-normal text-booknook-text truncate">
                  {selectedBorrow.bookTitle}
                </h4>
                <p className="text-[11px] text-booknook-text/60">
                  Borrowed on {formatDate(selectedBorrow.borrowDate)}
                </p>
                <p className="text-[11px] text-booknook-accent font-medium">
                  Scheduled return: {formatDate(selectedBorrow.returnDate)}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="mt-5 flex flex-col-reverse sm:flex-row gap-2 sm:justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => setReturnDialogOpen(false)}
              disabled={returning}
              className="border-booknook-border bg-booknook-white text-booknook-text hover:bg-booknook-secondary rounded-xs text-xs uppercase tracking-wider font-medium"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmReturn}
              disabled={returning}
              className="bg-booknook-accent text-booknook-bg hover:bg-booknook-accent/90 active:scale-[0.98] rounded-xs text-xs uppercase tracking-wider font-medium shadow-xs"
            >
              {returning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-booknook-bg" />
                  <span>Returning...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  <span>Confirm Return</span>
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
