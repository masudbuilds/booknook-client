"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BookMarked, LogOut, Menu, User } from "lucide-react";
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
      toast.success("Signed out successfully");
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
    <header className="sticky top-0 z-40 w-full border-b border-[#E5DED2] bg-[#F7F4ED]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#292820] text-[#F7F4ED] transition-colors group-hover:bg-[#987A50]">
            <BookMarked className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl tracking-tight text-[#292820] leading-none">
              BookNook
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#987A50] font-medium mt-0.5">
              Library & Shelves
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-4.5 lg:gap-7 md:flex">
          {visibleLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-xs tracking-wider uppercase font-medium transition-colors py-1 ${
                  isActive
                    ? "text-[#292820] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#987A50]"
                    : "text-[#292820]/70 hover:text-[#987A50]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Auth CTA / User Avatar */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-8 w-20 animate-pulse rounded-sm bg-[#EAE2D5]" />
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="User account menu"
                className="rounded-full outline-none focus:ring-2 focus:ring-[#987A50] focus:ring-offset-2 cursor-pointer"
              >
                <Avatar className="h-9 w-9 cursor-pointer border border-[#E5DED2]">
                  <AvatarImage
                    src={session.user.image || ""}
                    alt={session.user.name || "User"}
                  />
                  <AvatarFallback className="bg-[#EAE2D5] text-xs font-serif font-medium text-[#292820]">
                    {getInitials(session.user.name)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 p-2 shadow-lg bg-[#FFFFFF] border border-[#E5DED2] rounded-sm"
              >
                <div className="px-2 py-1.5">
                  <p className="font-serif text-sm font-medium text-[#292820]">
                    {session.user.name || "Reader"}
                  </p>
                  <p className="truncate text-xs text-[#292820]/60 mt-0.5">
                    {session.user.email}
                  </p>
                </div>
                <DropdownMenuSeparator className="bg-[#E5DED2]" />
                <DropdownMenuItem
                  onClick={() => router.push("/profile")}
                  className="cursor-pointer text-xs uppercase tracking-wider text-[#292820] hover:bg-[#EAE2D5]/50 focus:bg-[#EAE2D5]/50 rounded-xs py-2"
                >
                  <User className="mr-2 h-3.5 w-3.5 text-[#987A50]" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#E5DED2]" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-xs uppercase tracking-wider text-red-700 hover:bg-red-50 focus:bg-red-50 rounded-xs py-2"
                >
                  <LogOut className="mr-2 h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-xs tracking-wider uppercase text-[#292820] hover:bg-[#EAE2D5]/60 hover:text-[#292820] px-3 py-1.5 rounded-sm"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-[#292820] text-[#F7F4ED] hover:bg-[#987A50] text-xs tracking-wider uppercase px-4 py-1.5 rounded-sm transition-colors shadow-xs">
                  Join Library
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-[#292820] hover:bg-[#EAE2D5]/60 border border-[#E5DED2]"
              aria-label="Open navigation menu"
            >
              <Menu className="h-4 w-4" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-72 sm:w-80 max-w-[85vw] bg-[#F7F4ED] border-l border-[#E5DED2] p-6 flex flex-col justify-between"
            >
              <div>
                <SheetHeader className="text-left mb-8">
                  <SheetTitle className="flex items-center gap-2.5 font-serif text-lg text-[#292820]">
                    <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#292820] text-[#F7F4ED]">
                      <BookMarked className="h-3.5 w-3.5" />
                    </div>
                    BookNook
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col gap-2">
                  {visibleLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`text-xs uppercase tracking-widest py-2.5 border-b border-[#E5DED2]/50 transition-colors ${
                          isActive
                            ? "text-[#292820] font-semibold"
                            : "text-[#292820]/70 hover:text-[#987A50]"
                        }`}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="border-t border-[#E5DED2] pt-6">
                {session?.user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-[#E5DED2]">
                        <AvatarImage src={session.user.image || ""} />
                        <AvatarFallback className="bg-[#EAE2D5] text-xs font-serif text-[#292820]">
                          {getInitials(session.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-serif text-sm font-medium text-[#292820]">
                          {session.user.name}
                        </p>
                        <p className="truncate text-xs text-[#292820]/60">
                          {session.user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 pt-2">
                      <Link
                        href="/profile"
                        onClick={() => setMobileOpen(false)}
                        className="text-xs uppercase tracking-wider py-1.5 text-[#292820] hover:text-[#987A50]"
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={() => {
                          setMobileOpen(false);
                          handleLogout();
                        }}
                        className="text-left text-xs uppercase tracking-wider py-1.5 text-red-700 hover:text-red-800"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full border-[#E5DED2] bg-white text-xs uppercase tracking-wider text-[#292820] rounded-sm py-2"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full bg-[#292820] text-[#F7F4ED] hover:bg-[#987A50] text-xs uppercase tracking-wider rounded-sm py-2 shadow-xs">
                        Join Library
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
