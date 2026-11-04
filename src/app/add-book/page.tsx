"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Image as ImageIcon, Loader2, Upload } from "lucide-react";
import toast from "react-hot-toast";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
        "ImgBB API key is not configured. Please set NEXT_PUBLIC_IMGBB_API_KEY in .env or paste a direct image URL."
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
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Card className="border-[#E5DED2] bg-[#FFFFFF] shadow-sm">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 text-[#987A50]">
            <BookOpen className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Contribute a Book
            </span>
          </div>
          <CardTitle className="font-serif text-2xl font-bold text-[#292820] sm:text-3xl">
            Add a New Book
          </CardTitle>
          <CardDescription className="text-stone-500">
            Share a title with the BookNook community. Fill out the details below to add it to the catalog.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-stone-700 font-medium">
                  Book Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g. To Kill a Mockingbird"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="border-[#E5DED2] bg-white focus-visible:ring-[#987A50]"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="author" className="text-stone-700 font-medium">
                  Author Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="author"
                  type="text"
                  placeholder="e.g. Harper Lee"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                  className="border-[#E5DED2] bg-white focus-visible:ring-[#987A50]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-stone-700 font-medium">
                  Category <span className="text-red-500">*</span>
                </Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#E5DED2] bg-white px-2.5 py-1 text-sm text-[#292820] outline-none focus:border-[#987A50] focus:ring-1 focus:ring-[#987A50]"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="totalCopies" className="text-stone-700 font-medium">
                  Total Copies <span className="text-red-500">*</span>
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
                  className="border-[#E5DED2] bg-white focus-visible:ring-[#987A50]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-stone-700 font-medium">
                Book Cover Image <span className="text-red-500">*</span>
              </Label>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Input
                    type="url"
                    placeholder="https://example.com/cover.jpg or upload below"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    required
                    className="border-[#E5DED2] bg-white pr-10 focus-visible:ring-[#987A50]"
                  />
                  <ImageIcon className="absolute right-3 top-2 h-4 w-4 text-stone-400 pointer-events-none" />
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
                    className="w-full sm:w-auto border-[#E5DED2] bg-white text-[#292820] hover:bg-[#EAE2D5]"
                  >
                    {uploadingImage ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#987A50]" />
                    ) : (
                      <Upload className="mr-2 h-4 w-4 text-[#987A50]" />
                    )}
                    Upload to ImgBB
                  </Button>
                </div>
              </div>

              {imageUrl && (
                <div className="mt-3 flex items-center gap-3 rounded-lg border border-[#E5DED2] bg-white p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Cover preview"
                    className="h-16 w-12 rounded object-cover border border-[#E5DED2] shrink-0"
                    onError={() => toast.error("Could not load preview from the provided URL")}
                  />
                  <div className="min-w-0 flex-1 truncate text-xs text-stone-500">
                    <p className="font-semibold text-stone-800">Cover Preview</p>
                    <p className="truncate">{imageUrl}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-stone-700 font-medium">
                Short Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="A compelling synopsis or review of the book..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                className="border-[#E5DED2] bg-white focus-visible:ring-[#987A50]"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-5 rounded-lg border border-[#E5DED2] bg-[#EAE2D5]/30 p-4 sm:grid-cols-2 text-xs">
              <div className="min-w-0">
                <span className="font-medium text-stone-500">Submitted By:</span>
                <p className="font-semibold text-stone-800 truncate">{session?.user?.name || "Reader"}</p>
              </div>
              <div className="min-w-0">
                <span className="font-medium text-stone-500">User Email (Read-only):</span>
                <p className="font-semibold text-stone-800 truncate">{session?.user?.email || "N/A"}</p>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={submitting || uploadingImage}
                className="w-full bg-[#292820] text-[#F7F4ED] hover:bg-[#987A50] sm:w-auto px-8 active:scale-[0.98] transition-all shadow-xs"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Book...
                  </>
                ) : (
                  "Add Book"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
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
