"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BookOpen, LogOut, Menu, User } from "lucide-react";
import toast from "react-hot-toast";

import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to sign out");
    }
  };

  const navLinks = [
    { name: "Home", href: "/", isPrivate: false },
    { name: "All Books", href: "/books", isPrivate: false },
    { name: "Add Book", href: "/add-book", isPrivate: true },
    { name: "My Books", href: "/my-books", isPrivate: true },
    { name: "My Borrows", href: "/my-borrows", isPrivate: true },
  ];

  const visibleLinks = navLinks.filter(
    (link) => !link.isPrivate || (session && !isPending)
  );

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-[#FDFBF7]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1C3F3A] text-amber-50 shadow-sm transition-transform group-hover:scale-105">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight text-[#1C3F3A]">
            BookNook
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {visibleLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#1C3F3A]/10 text-[#1C3F3A] font-semibold"
                    : "text-stone-600 hover:bg-stone-200/60 hover:text-stone-900"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-8 w-20 animate-pulse rounded bg-stone-200" />
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full outline-none focus:ring-2 focus:ring-[#1C3F3A] focus:ring-offset-2">
                <Avatar className="h-9 w-9 cursor-pointer border border-stone-300">
                  <AvatarImage
                    src={session.user.image || ""}
                    alt={session.user.name || "User"}
                  />
                  <AvatarFallback className="bg-[#1C3F3A] text-xs font-semibold text-white">
                    {getInitials(session.user.name)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 shadow-lg bg-[#FDFBF7] border border-stone-200">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-semibold text-stone-900">
                    {session.user.name || "Reader"}
                  </p>
                  <p className="truncate text-xs text-stone-500">
                    {session.user.email}
                  </p>
                </div>
                <DropdownMenuSeparator className="bg-stone-200" />
                <DropdownMenuItem
                  onClick={() => router.push("/profile")}
                  className="cursor-pointer text-stone-700 hover:bg-stone-100"
                >
                  <User className="mr-2 h-4 w-4 text-stone-500" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-stone-200" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-stone-700 hover:bg-stone-200/60 hover:text-stone-900"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-[#1C3F3A] text-white hover:bg-[#15302C]">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="flex md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-stone-700 hover:bg-stone-200/60"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-72 bg-[#FDFBF7] border-l border-stone-200 p-6 flex flex-col justify-between"
            >
              <div>
                <SheetHeader className="text-left mb-6">
                  <SheetTitle className="flex items-center gap-2 font-serif text-lg font-bold text-[#1C3F3A]">
                    <BookOpen className="h-5 w-5" />
                    BookNook
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col gap-1">
                  {visibleLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-[#1C3F3A]/10 text-[#1C3F3A] font-semibold"
                            : "text-stone-600 hover:bg-stone-200/60 hover:text-stone-900"
                        }`}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="border-t border-stone-200 pt-4">
                {session?.user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-stone-300">
                        <AvatarImage src={session.user.image || ""} />
                        <AvatarFallback className="bg-[#1C3F3A] text-xs text-white">
                          {getInitials(session.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="truncate">
                        <p className="text-sm font-semibold text-stone-900 truncate">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-stone-500 truncate">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-stone-700 border-stone-300"
                      onClick={() => {
                        setMobileOpen(false);
                        router.push("/profile");
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full justify-start"
                      onClick={() => {
                        setMobileOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full border-stone-300">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full bg-[#1C3F3A] text-white hover:bg-[#15302C]">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
