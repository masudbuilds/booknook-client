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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col justify-between gap-4 border-b border-stone-200 pb-6 sm:flex-row sm:items-end">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C86244]">
            Personal Shelf
          </span>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#1C3F3A] sm:text-4xl">
            My Books
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Manage the titles you have added to BookNook. Update book details or remove entries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!loading && !error && (
            <span className="text-sm font-medium text-stone-500">
              Total Added:{" "}
              <span className="font-semibold text-stone-900">{books.length}</span>
            </span>
          )}
          <Link href="/add-book">
            <Button className="bg-[#1C3F3A] text-white hover:bg-[#15302C]">
              <Plus className="mr-1.5 h-4 w-4" />
              Add Book
            </Button>
          </Link>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex h-80 animate-pulse flex-col rounded-xl border border-stone-200 bg-white p-4"
            >
              <div className="h-44 w-full rounded-lg bg-stone-200" />
              <div className="mt-4 space-y-2">
                <div className="h-4 w-3/4 rounded bg-stone-200" />
                <div className="h-3 w-1/2 rounded bg-stone-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white p-12 text-center shadow-xs">
          <BookOpen className="h-10 w-10 text-stone-300" />
          <h3 className="mt-3 font-serif text-lg font-semibold text-stone-800">
            Could not retrieve your books
          </h3>
          <p className="mt-1 max-w-sm text-sm text-stone-500">{error}</p>
          <Button
            onClick={() => fetchMyBooks(true)}
            variant="outline"
            className="mt-4 border-stone-300"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      )}

      {!loading && !error && books.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white/50 p-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-[#1C3F3A]">
            <BookOpen className="h-7 w-7" />
          </div>
          <h3 className="mt-4 font-serif text-xl font-bold text-stone-900">
            You haven&apos;t added any books yet
          </h3>
          <p className="mt-1 max-w-sm text-sm text-stone-500">
            Share your favorite reads with the community by contributing your first book.
          </p>
          <Link href="/add-book" className="mt-6">
            <Button className="bg-[#1C3F3A] text-white hover:bg-[#15302C]">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Book
            </Button>
          </Link>
        </div>
      )}

      {!loading && !error && books.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <div
              key={book._id}
              className="flex h-full flex-col overflow-hidden rounded-xl border border-stone-200/90 bg-[#FDFBF7] shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div className="relative aspect-3/4 w-full overflow-hidden bg-stone-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={book.image}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="outline" className="bg-white/90 font-semibold text-xs border-stone-300">
                    {book.category}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="rounded-full bg-emerald-900/80 px-2 py-0.5 text-[11px] font-semibold text-white">
                    {book.availableCopies} / {book.totalCopies} copies
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-serif text-base font-bold text-stone-900 line-clamp-1">
                  {book.title}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">By {book.author}</p>
                <p className="mt-2 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {book.description}
                </p>

                <div className="mt-auto pt-4 flex items-center gap-2 border-t border-stone-200/70">
                  <Link href={`/books/${book._id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full border-stone-300 text-stone-700">
                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                      View
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingBook(book);
                      setEditOpen(true);
                    }}
                    className="border-stone-300 text-stone-700 hover:text-[#1C3F3A]"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDeletingBook(book);
                      setDeleteOpen(true);
                    }}
                    className="border-stone-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Book Modal */}
      <EditBookDialog
        book={editingBook}
        open={editOpen}
        onOpenChange={setEditOpen}
        onBookUpdated={handleBookUpdated}
      />

      {/* Delete Confirmation Modal (NO window.confirm!) */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 mb-2">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center font-serif text-xl">
              Delete Book from Library?
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-stone-500">
              Are you sure you want to delete &quot;{deletingBook?.title}&quot;? This action cannot be undone and will permanently remove this title from the library catalog.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex gap-2 sm:justify-center">
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isDeleting}
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
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
