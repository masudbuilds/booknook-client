"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, Eye, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Book {
  _id?: string;
  id?: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description?: string;
  totalCopies?: number;
  availableCopies?: number;
}

interface BookCardProps {
  book: Book;
}

const categoryStyles: Record<string, string> = {
  Fiction: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Science: "bg-blue-100 text-blue-800 border-blue-200",
  History: "bg-amber-100 text-amber-800 border-amber-200",
  Kids: "bg-purple-100 text-purple-800 border-purple-200",
  Others: "bg-stone-100 text-stone-800 border-stone-200",
};

export default function BookCard({ book }: BookCardProps) {
  const [imageError, setImageError] = useState(false);
  const bookId = book._id || book.id || "";
  const categoryClass = categoryStyles[book.category] || categoryStyles.Others;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-stone-200/90 bg-[#FDFBF7] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
        {!imageError && book.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.image}
            alt={book.title}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-stone-100 p-4 text-stone-400">
            <BookOpen className="h-10 w-10 text-stone-300" />
            <span className="text-xs font-medium text-stone-400">No cover image</span>
          </div>
        )}

        <div className="absolute top-3 left-3">
          <Badge
            variant="outline"
            className={`border px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm shadow-xs ${categoryClass}`}
          >
            {book.category}
          </Badge>
        </div>

        {book.availableCopies !== undefined && (
          <div className="absolute top-3 right-3">
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide backdrop-blur-sm shadow-xs ${
                book.availableCopies > 0
                  ? "bg-emerald-900/80 text-emerald-100"
                  : "bg-red-900/80 text-red-100"
              }`}
            >
              {book.availableCopies > 0 ? `${book.availableCopies} available` : "Unavailable"}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3
          title={book.title}
          className="line-clamp-2 font-serif text-base font-bold text-stone-900 leading-snug group-hover:text-[#1C3F3A] transition-colors"
        >
          {book.title}
        </h3>

        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-stone-500">
          <User className="h-3.5 w-3.5 shrink-0 text-stone-400" />
          <span className="truncate">{book.author}</span>
        </div>

        <div className="mt-auto pt-4">
          <Link href={`/books/${bookId}`} className="block w-full">
            <Button
              className="w-full bg-[#1C3F3A] text-white hover:bg-[#15302C] transition-colors shadow-xs"
              size="sm"
            >
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
