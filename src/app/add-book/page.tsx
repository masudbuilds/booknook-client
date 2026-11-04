"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  Upload,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const categories = ["Fiction", "Science", "History", "Kids", "Others"] as const;

function AddBookForm() {
  const router = useRouter();
  const { data: session } = useSession();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState<string>("Fiction");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [totalCopies, setTotalCopies] = useState<number | string>(1);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "BookNook | Add Book";
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      toast.error(
        "ImgBB API key is not configured. Please paste a direct image URL or configure NEXT_PUBLIC_IMGBB_API_KEY."
      );
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to upload image to ImgBB");
      }

      setImageUrl(data.data.url);
      toast.success("Cover image uploaded successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Image upload failed";
      toast.error(msg);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !author.trim() || !description.trim() || !imageUrl.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const copies = Number(totalCopies);
    if (isNaN(copies) || copies < 1 || !Number.isInteger(copies)) {
      toast.error("Total copies must be a positive whole number (at least 1)");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Fetch JWT from Next.js auth endpoint
      const jwtRes = await fetch("/api/auth/jwt");
      if (!jwtRes.ok) {
        throw new Error("Your session has expired. Please sign in again.");
      }
      const { token } = await jwtRes.json();

      // 2. Submit new book to Express API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          author: author.trim(),
          category,
          image: imageUrl.trim(),
          description: description.trim(),
          totalCopies: copies,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to add book");
      }

      toast.success("Book added to the library catalog!");
      const insertedId = result.insertedId || result._id;
      if (insertedId) {
        router.push(`/books/${insertedId}`);
      } else {
        router.push("/my-books");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add book";
      toast.error(msg);
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-3 border-b border-booknook-border pb-6 sm:pb-8">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-booknook-accent" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-booknook-accent">
            Contribute To The Catalog
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-booknook-text font-normal tracking-tight">
          Add a Book to BookNook
        </h1>
        <p className="text-xs sm:text-sm text-booknook-text/75 font-light leading-relaxed max-w-2xl">
          Share a cherished volume with fellow readers. Fill in the title details below to catalog
          it on our community shelves.
        </p>
      </div>

      {/* Main Submission Form Card */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="rounded-xs border border-booknook-border bg-booknook-white p-6 sm:p-8 md:p-10 shadow-xs space-y-6">
          {/* Section: Title & Author */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-xs uppercase tracking-wider font-medium text-booknook-text"
              >
                Book Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="e.g. To Kill a Mockingbird"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-10 bg-booknook-bg/40 border-booknook-border focus-visible:border-booknook-accent focus-visible:ring-1 focus-visible:ring-booknook-accent text-booknook-text text-sm rounded-xs placeholder:text-booknook-text/40 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="author"
                className="text-xs uppercase tracking-wider font-medium text-booknook-text"
              >
                Author Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="author"
                type="text"
                placeholder="e.g. Harper Lee"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="h-10 bg-booknook-bg/40 border-booknook-border focus-visible:border-booknook-accent focus-visible:ring-1 focus-visible:ring-booknook-accent text-booknook-text text-sm rounded-xs placeholder:text-booknook-text/40 transition-colors"
              />
            </div>
          </div>

          {/* Section: Category & Total Copies */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="category"
                className="text-xs uppercase tracking-wider font-medium text-booknook-text"
              >
                Genre / Shelf <span className="text-destructive">*</span>
              </Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-10 w-full rounded-xs border border-booknook-border bg-booknook-bg/40 px-3 text-sm text-booknook-text outline-none transition-colors focus:border-booknook-accent focus:ring-1 focus:ring-booknook-accent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="totalCopies"
                className="text-xs uppercase tracking-wider font-medium text-booknook-text"
              >
                Available Copies <span className="text-destructive">*</span>
              </Label>
              <Input
                id="totalCopies"
                type="number"
                min="1"
                step="1"
                placeholder="1"
                value={totalCopies}
                onChange={(e) => setTotalCopies(e.target.value)}
                required
                className="h-10 bg-booknook-bg/40 border-booknook-border focus-visible:border-booknook-accent focus-visible:ring-1 focus-visible:ring-booknook-accent text-booknook-text text-sm rounded-xs placeholder:text-booknook-text/40 transition-colors"
              />
            </div>
          </div>

          {/* Section: Book Cover Image & Uploader */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs uppercase tracking-wider font-medium text-booknook-text">
                Cover Image URL or Upload <span className="text-destructive">*</span>
              </Label>
              <span className="text-[11px] text-booknook-text/60 font-light">
                Direct URL or file upload
              </span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Input
                  type="url"
                  placeholder="https://images.unsplash.com/... or paste image link"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                  className="h-10 bg-booknook-bg/40 border-booknook-border pr-10 focus-visible:border-booknook-accent focus-visible:ring-1 focus-visible:ring-booknook-accent text-booknook-text text-sm rounded-xs placeholder:text-booknook-text/40 transition-colors"
                />
                <ImageIcon className="absolute right-3 top-3 h-4 w-4 text-booknook-text/40 pointer-events-none" />
              </div>

              <div className="relative w-full sm:w-auto">
                <input
                  type="file"
                  id="fileUpload"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploadingImage}
                  onClick={() => document.getElementById("fileUpload")?.click()}
                  className="w-full sm:w-auto h-10 border-booknook-border bg-booknook-white text-booknook-text hover:bg-booknook-secondary rounded-xs text-xs uppercase tracking-wider font-medium transition-colors"
                >
                  {uploadingImage ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-booknook-accent" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4 text-booknook-accent" />
                  )}
                  Upload Cover
                </Button>
              </div>
            </div>

            {/* Live Cover Preview Panel */}
            {imageUrl && (
              <div className="mt-3 flex items-start gap-4 rounded-xs border border-booknook-border bg-booknook-bg/60 p-3 sm:p-4">
                <div className="relative aspect-3/4 w-14 sm:w-16 shrink-0 overflow-hidden rounded-xs border border-booknook-border bg-booknook-white shadow-2xs after:absolute after:inset-y-0 after:left-0 after:w-1.5 after:bg-linear-to-r after:from-black/25 after:to-transparent">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Cover preview"
                    className="h-full w-full object-cover"
                    onError={() => toast.error("Could not load preview from the provided URL")}
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-booknook-accent" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-booknook-text">
                      Cover Preview
                    </p>
                  </div>
                  <p className="truncate text-xs text-booknook-text/70 font-mono">{imageUrl}</p>
                  <p className="text-[11px] text-booknook-text/50 font-light">
                    The cover will be displayed with an authentic book spine effect in the library.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Synopsis / Description */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="description"
                className="text-xs uppercase tracking-wider font-medium text-booknook-text"
              >
                Short Synopsis / Description <span className="text-destructive">*</span>
              </Label>
              <span className="text-[11px] text-booknook-text/60 font-light">
                {description.length} characters
              </span>
            </div>
            <Textarea
              id="description"
              placeholder="Provide a compelling overview, theme summary, or reader recommendation..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              className="bg-booknook-bg/40 border-booknook-border focus-visible:border-booknook-accent focus-visible:ring-1 focus-visible:ring-booknook-accent text-booknook-text text-sm rounded-xs placeholder:text-booknook-text/40 transition-colors resize-y"
            />
          </div>

          {/* Section: Read-only Contributor Badge */}
          <div className="rounded-xs border border-booknook-border bg-booknook-secondary/35 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xs bg-booknook-text text-booknook-bg">
                <User className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-booknook-accent font-semibold">
                  Contributing Reader
                </span>
                <span className="font-serif text-sm font-normal text-booknook-text">
                  {session?.user?.name || "Library Member"}
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-booknook-border/60 w-full sm:w-auto">
              <span className="block text-[10px] uppercase tracking-wider text-booknook-text/60">
                Verified Account
              </span>
              <span className="font-mono text-xs text-booknook-text/80">
                {session?.user?.email || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <Button
            type="submit"
            disabled={submitting || uploadingImage}
            className="bg-booknook-accent text-booknook-bg hover:bg-booknook-accent/90 active:scale-[0.98] rounded-xs px-8 py-3 text-xs uppercase tracking-widest font-medium transition-all shadow-xs gap-2 cursor-pointer h-11"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-booknook-bg" />
                <span>Publishing to Catalog...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-booknook-bg" />
                <span>Publish Book to Catalog</span>
              </>
            )}
          </Button>

          <button
            type="button"
            onClick={() => router.back()}
            className="text-xs uppercase tracking-widest font-medium text-booknook-text/75 hover:text-booknook-accent transition-colors py-2 text-center sm:text-right cursor-pointer"
          >
            Cancel & Return
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AddBookPage() {
  return (
    <ProtectedRoute>
      <AddBookForm />
    </ProtectedRoute>
  );
}
