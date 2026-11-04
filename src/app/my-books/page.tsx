"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  Eye,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useSession } from "@/lib/auth-client";
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
import EditBookDialog, { ManagedBook } from "@/components/EditBookDialog";

function MyBooksContent() {
  const { data: session } = useSession();
  const [books, setBooks] = useState<ManagedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit dialog state
  const [editingBook, setEditingBook] = useState<ManagedBook | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  // Delete dialog state
  const [deletingBook, setDeletingBook] = useState<ManagedBook | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMyBooks = (isRetry = false) => {
    if (!session?.user?.email) return;
    if (isRetry) {
      setLoading(true);
      setError(null);
    }

    fetch("/api/auth/jwt")
      .then((jwtRes) => {
        if (!jwtRes.ok) throw new Error("Authentication required");
        return jwtRes.json();
      })
      .then(({ token }) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const emailParam = encodeURIComponent(session.user.email);
        return fetch(`${apiUrl}/books?email=${emailParam}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });
      })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.message || "Failed to load your books");
        }
        const list = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
            ? json
            : [];
        setBooks(list);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Unable to retrieve your books";
        setError(msg);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    document.title = "BookNook | My Books";
    let ignore = false;
    if (!session?.user?.email) return;

    fetch("/api/auth/jwt")
      .then((jwtRes) => {
        if (!jwtRes.ok) throw new Error("Authentication required");
        return jwtRes.json();
      })
      .then(({ token }) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const emailParam = encodeURIComponent(session.user.email);
        return fetch(`${apiUrl}/books?email=${emailParam}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });
      })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.message || "Failed to load your books");
        }
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
          const msg = err instanceof Error ? err.message : "Unable to retrieve your books";
          setError(msg);
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
  }, [session?.user?.email]);

  const handleDelete = async () => {
    if (!deletingBook) return;

    setIsDeleting(true);
    try {
      const jwtRes = await fetch("/api/auth/jwt");
      if (!jwtRes.ok) throw new Error("Session expired. Please log in again.");
      const { token } = await jwtRes.json();

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/books/${deletingBook._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete book");
      }

      toast.success("Book deleted from library");
      setBooks((prev) => prev.filter((b) => b._id !== deletingBook._id));
      setDeleteOpen(false);
      setDeletingBook(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not delete book";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBookUpdated = (updatedBook: ManagedBook) => {
    setBooks((prev) =>
      prev.map((b) => (b._id === updatedBook._id ? updatedBook : b))
    );
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-booknook-border pb-6 sm:pb-8 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-booknook-accent" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-booknook-accent">
              Personal Shelf
            </span>
          </div>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl text-booknook-text font-normal tracking-tight">
            My Contributed Books
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-booknook-text/75 font-light leading-relaxed max-w-2xl">
            Manage the titles you have added to the BookNook catalog. Update book metadata or safely
            retire unborrowed volumes.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          {!loading && !error && (
            <div className="inline-flex items-center gap-1.5 rounded-xs border border-booknook-border bg-booknook-white px-3 py-1.5 text-xs text-booknook-text font-medium shadow-2xs">
              <span className="text-booknook-text/60">Total Contributed:</span>
              <span className="font-semibold text-booknook-accent">{books.length}</span>
            </div>
          )}
          <Link href="/add-book" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-booknook-accent text-booknook-bg hover:bg-booknook-accent/90 active:scale-[0.98] rounded-xs text-xs uppercase tracking-widest font-medium transition-all shadow-xs gap-2 cursor-pointer h-10 px-5">
              <Plus className="h-4 w-4" />
              <span>Add a Book</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="flex h-full animate-pulse flex-col overflow-hidden rounded-xs border border-booknook-border bg-booknook-white shadow-2xs"
            >
              <div className="aspect-3/4 w-full bg-booknook-secondary/50" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-3/4 rounded-xs bg-booknook-secondary/60" />
                <div className="h-3 w-1/2 rounded-xs bg-booknook-secondary/40" />
                <div className="h-10 w-full rounded-xs bg-booknook-secondary/30 mt-4" />
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
          className="flex flex-col items-center justify-center rounded-xs border border-booknook-border bg-booknook-white p-12 text-center shadow-xs"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xs bg-booknook-secondary text-booknook-accent mb-3">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="font-serif text-xl font-normal text-booknook-text">
            Could not retrieve your collection
          </h3>
          <p className="mt-1 max-w-sm text-xs text-booknook-text/70 font-light">{error}</p>
          <Button
            onClick={() => fetchMyBooks(true)}
            variant="outline"
            className="mt-5 border-booknook-border bg-booknook-white text-booknook-text hover:bg-booknook-secondary rounded-xs text-xs uppercase tracking-widest font-medium active:scale-[0.98] transition-all"
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5 text-booknook-accent" />
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && books.length === 0 && (
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center justify-center rounded-xs border border-dashed border-booknook-border bg-booknook-white/70 p-12 sm:p-16 text-center shadow-xs"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xs bg-booknook-secondary text-booknook-accent">
            <BookOpen className="h-7 w-7" />
          </div>
          <h3 className="mt-4 font-serif text-2xl font-normal text-booknook-text">
            Your Personal Shelf is Empty
          </h3>
          <p className="mt-2 max-w-md text-xs sm:text-sm text-booknook-text/70 font-light leading-relaxed">
            You haven&apos;t added any books to BookNook yet. Share a beloved novel, historical
            volume, or educational title with our community.
          </p>
          <Link href="/add-book" className="mt-6">
            <Button className="bg-booknook-accent text-booknook-bg hover:bg-booknook-accent/90 active:scale-[0.98] rounded-xs text-xs uppercase tracking-widest font-medium transition-all shadow-xs gap-2 cursor-pointer h-10 px-6">
              <Plus className="h-4 w-4" />
              <span>Contribute Your First Book</span>
            </Button>
          </Link>
        </div>
      )}

      {/* Contributed Books Grid */}
      {!loading && !error && books.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => {
            const isAvailable = (book.availableCopies || 0) > 0;
            return (
              <div
                key={book._id}
                className="group flex h-full flex-col overflow-hidden rounded-xs border border-booknook-border bg-booknook-white shadow-2xs transition-all duration-300 hover:border-booknook-accent hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Book Cover with Spine Shadow Effect */}
                <div className="relative aspect-3/4 w-full overflow-hidden bg-booknook-secondary/40 after:absolute after:inset-y-0 after:left-0 after:w-2 after:bg-linear-to-r after:from-black/25 after:to-transparent after:pointer-events-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={book.image}
                    alt={`Cover of ${book.title}`}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 z-10 max-w-[55%]">
                    <Badge
                      variant="outline"
                      className="bg-booknook-bg/95 font-medium text-[11px] border-booknook-border text-booknook-text max-w-full truncate shadow-2xs rounded-xs uppercase tracking-wider"
                    >
                      {book.category}
                    </Badge>
                  </div>
                  {/* Inventory Pill */}
                  <div className="absolute top-3 right-3 z-10 shrink-0">
                    <span
                      className={`inline-flex items-center rounded-xs px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-medium shadow-2xs ${
                        isAvailable
                          ? "bg-booknook-text text-booknook-bg"
                          : "bg-destructive text-white"
                      }`}
                    >
                      {book.availableCopies} / {book.totalCopies} Available
                    </span>
                  </div>
                </div>

                {/* Book Details */}
                <div className="flex flex-1 flex-col p-5 space-y-2">
                  <h3 className="font-serif text-lg font-normal text-booknook-text line-clamp-1 group-hover:text-booknook-accent transition-colors">
                    <Link
                      href={`/books/${book._id}`}
                      className="hover:underline underline-offset-2"
                    >
                      {book.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-booknook-text/60 font-light">By {book.author}</p>
                  <p className="text-xs text-booknook-text/75 font-light line-clamp-2 leading-relaxed">
                    {book.description}
                  </p>

                  {/* Actions Footer */}
                  <div className="mt-auto pt-4 flex items-center gap-2 border-t border-booknook-border">
                    <Link href={`/books/${book._id}`} className="flex-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-8.5 border-booknook-border bg-booknook-white text-booknook-text hover:bg-booknook-secondary active:scale-[0.98] rounded-xs text-[11px] uppercase tracking-wider font-medium transition-all"
                      >
                        <Eye className="mr-1.5 h-3.5 w-3.5 text-booknook-accent" />
                        <span>View</span>
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="sm"
                      aria-label={`Edit ${book.title}`}
                      onClick={() => {
                        setEditingBook(book);
                        setEditOpen(true);
                      }}
                      className="h-8.5 px-3 border-booknook-border bg-booknook-white text-booknook-text hover:text-booknook-accent hover:border-booknook-accent active:scale-[0.98] rounded-xs transition-all"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      <span className="sr-only">Edit {book.title}</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      aria-label={`Delete ${book.title}`}
                      onClick={() => {
                        setDeletingBook(book);
                        setDeleteOpen(true);
                      }}
                      className="h-8.5 px-3 border-destructive/30 bg-booknook-white text-destructive hover:bg-destructive/10 hover:border-destructive active:scale-[0.98] rounded-xs transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Delete {book.title}</span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Book Modal */}
      <EditBookDialog
        book={editingBook}
        open={editOpen}
        onOpenChange={setEditOpen}
        onBookUpdated={handleBookUpdated}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md bg-booknook-white border border-booknook-border rounded-xs p-6">
          <DialogHeader className="space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xs bg-destructive/10 text-destructive mb-1">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center font-serif text-2xl font-normal text-booknook-text">
              Remove Book from Catalog?
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-booknook-text/70 font-light leading-relaxed">
              Are you sure you want to remove &ldquo;{deletingBook?.title}&rdquo;? This action cannot
              be undone and will permanently remove this volume from the community library catalog.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-5 flex flex-col-reverse sm:flex-row gap-2 sm:justify-center">
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => setDeleteOpen(false)}
              className="border-booknook-border bg-booknook-white text-booknook-text hover:bg-booknook-secondary rounded-xs text-xs uppercase tracking-wider font-medium"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isDeleting}
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90 active:scale-[0.98] rounded-xs text-xs uppercase tracking-wider font-medium shadow-xs"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                "Delete Book"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function MyBooksPage() {
  return (
    <ProtectedRoute>
      <MyBooksContent />
    </ProtectedRoute>
  );
}