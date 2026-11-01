"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const categories = ["Fiction", "Science", "History", "Kids", "Others"] as const;

export interface ManagedBook {
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
}

interface EditBookDialogProps {
  book: ManagedBook | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookUpdated: (updatedBook: ManagedBook) => void;
}

export default function EditBookDialog({
  book,
  open,
  onOpenChange,
  onBookUpdated,
}: EditBookDialogProps) {
  const [title, setTitle] = useState(book?.title || "");
  const [author, setAuthor] = useState(book?.author || "");
  const [category, setCategory] = useState(book?.category || "Fiction");
  const [image, setImage] = useState(book?.image || "");
  const [description, setDescription] = useState(book?.description || "");
  const [totalCopies, setTotalCopies] = useState<number | string>(book?.totalCopies || 1);
  const [submitting, setSubmitting] = useState(false);

  // Sync state whenever the opened book changes
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && book) {
      setTitle(book.title);
      setAuthor(book.author);
      setCategory(book.category);
      setImage(book.image);
      setDescription(book.description);
      setTotalCopies(book.totalCopies);
    }
    onOpenChange(newOpen);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;

    if (!title.trim() || !author.trim() || !description.trim() || !image.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const copies = Number(totalCopies);
    if (isNaN(copies) || copies < 1 || !Number.isInteger(copies)) {
      toast.error("Total copies must be a positive whole number");
      return;
    }

    setSubmitting(true);
    try {
      const jwtRes = await fetch("/api/auth/jwt");
      if (!jwtRes.ok) throw new Error("Session expired. Please log in again.");
      const { token } = await jwtRes.json();

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/books/${book._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          author: author.trim(),
          category,
          image: image.trim(),
          description: description.trim(),
          totalCopies: copies,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update book");
      }

      toast.success("Book updated successfully!");

      // Compute updated available copies in local state
      const borrowed = Math.max(0, (book.totalCopies || 0) - (book.availableCopies || 0));
      const newAvailable = Math.max(0, copies - borrowed);

      onBookUpdated({
        ...book,
        title: title.trim(),
        author: author.trim(),
        category,
        image: image.trim(),
        description: description.trim(),
        totalCopies: copies,
        availableCopies: newAvailable,
      });

      onOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Update failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Book Details</DialogTitle>
          <DialogDescription>
            Update the information for this book. Changes will update the catalog immediately.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4 py-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-title">Book Title</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-author">Author Name</Label>
              <Input
                id="edit-author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-category">Category</Label>
              <select
                id="edit-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-8 w-full rounded-lg border border-stone-300 bg-white px-2.5 py-1 text-sm text-stone-900 outline-none focus:border-[#1C3F3A]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-totalCopies">Total Copies</Label>
              <Input
                id="edit-totalCopies"
                type="number"
                min="1"
                step="1"
                value={totalCopies}
                onChange={(e) => setTotalCopies(e.target.value)}
                required
                className="bg-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-image">Cover Image URL</Label>
            <Input
              id="edit-image"
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
              className="bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="bg-white"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-[#1C3F3A] text-white hover:bg-[#15302C]"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

