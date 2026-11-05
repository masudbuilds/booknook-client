import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";

import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookNook – A Small Online Library",
  description: "An elegant, minimalist community library to discover, borrow, and share beloved books.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-booknook-bg text-booknook-text font-sans antialiased selection:bg-booknook-accent selection:text-booknook-white overflow-x-hidden">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "var(--color-booknook-text, #292820)",
              color: "var(--color-booknook-bg, #F7F4ED)",
              border: "1px solid var(--color-booknook-border, #E5DED2)",
              fontSize: "13px",
              borderRadius: "4px",
            },
          }}
        />
        <Navbar />
        <main className="flex flex-1 flex-col w-full overflow-x-hidden">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
