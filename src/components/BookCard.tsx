"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, BookOpen } from "lucide-react";

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

export default function BookCard({ book }: BookCardProps) {
  const [imageError, setImageError] = useState(false);
  const bookId = book._id || book.id || "";
  const isAvailable = (book.availableCopies ?? 1) > 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-sm border border-[#E5DED2] bg-white transition-all duration-300 hover:border-[#987A50] hover:-translate-y-0.5 hover:shadow-md focus-within:border-[#987A50] focus-within:ring-2 focus-within:ring-[#987A50]/40">
      {/* Cover image container with editorial book spine shadow */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#EAE2D5]/40 border-b border-[#E5DED2] after:absolute after:inset-y-0 after:left-0 after:w-2.5 after:bg-gradient-to-r after:from-black/20 after:to-transparent after:pointer-events-none">
        {!imageError && book.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.image}
            alt={`Cover of ${book.title}`}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-[#292820]/40">
            <BookOpen className="h-10 w-10 text-[#987A50]/40" />
            <span className="text-xs uppercase tracking-wider font-light">No Cover</span>
          </div>
        )}

        {/* Top badges */}
        <div className="absolute top-3 left-3 max-w-[55%] z-10">
          <span className="inline-block max-w-full truncate rounded-xs bg-[#F7F4ED]/95 backdrop-blur-xs px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-medium text-[#292820] border border-[#E5DED2] shadow-2xs">
            {book.category}
          </span>
        </div>

        {book.availableCopies !== undefined && (
          <div className="absolute top-3 right-3 shrink-0 z-10">
            <span
              className={`inline-flex items-center gap-1.5 rounded-xs px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium backdrop-blur-xs border shadow-2xs ${
                isAvailable
                  ? "bg-[#F7F4ED]/95 text-[#292820] border-[#E5DED2]"
                  : "bg-red-50/95 text-red-800 border-red-200"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isAvailable ? "bg-[#987A50]" : "bg-red-500"
                }`}
              />
              {isAvailable ? `${book.availableCopies} in stock` : "On loan"}
            </span>
          </div>
        )}
      </div>

      {/* Book details */}
      <div className="flex flex-1 flex-col p-5">
        <h3
          title={book.title}
          className="line-clamp-1 font-serif text-lg font-normal text-[#292820] group-hover:text-[#987A50] transition-colors"
        >
          <Link
            href={`/books/${bookId}`}
            className="hover:underline underline-offset-2 outline-none focus-visible:ring-1 focus-visible:ring-[#987A50]"
          >
            {book.title}
          </Link>
        </h3>

        <p className="mt-1 text-xs text-[#292820]/65 font-light tracking-wide truncate">
          By {book.author}
        </p>

        {book.description && (
          <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-[#292820]/70 font-light">
            {book.description}
          </p>
        )}

        {/* Action button */}
        <div className="mt-auto pt-4 border-t border-[#E5DED2]/60">
          <Link
            href={`/books/${bookId}`}
            aria-label={`View details for ${book.title} by ${book.author}`}
            className="flex items-center justify-between text-xs uppercase tracking-widest font-medium text-[#292820] group-hover:text-[#987A50] transition-colors py-1 outline-none focus-visible:ring-1 focus-visible:ring-[#987A50] rounded-xs"
          >
            <span>View Details</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
