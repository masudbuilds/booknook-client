"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { BookOpen, Eye, EyeOff, Loader2, Sparkles, Quote } from "lucide-react";
import toast from "react-hot-toast";

import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setLoading(true);
    try {
      const res = await signIn.email({
        email,
        password,
      });

      if (res.error) {
        toast.error(res.error.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      toast.success("Signed in successfully!");
      router.push(callbackUrl);
      router.refresh();
    } catch {
      toast.error("An unexpected error occurred during sign in");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const res = await signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });

      if (res?.error) {
        toast.error(res.error.message || "Failed to start Google sign in");
        setGoogleLoading(false);
      }
    } catch {
      toast.error("Failed to connect to Google authentication");
      setGoogleLoading(false);
    }
  };

  const registerHref = `/register${
    callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""
  }`;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-booknook-bg flex items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="w-full max-w-4xl overflow-hidden rounded-xs border border-booknook-border bg-booknook-white shadow-xs grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Visual Editorial Panel */}
        <div className="relative hidden lg:col-span-5 lg:flex lg:flex-col lg:justify-between p-8 xl:p-10 text-white overflow-hidden bg-booknook-text">
          {/* Background Image with Dark Vignette */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-45 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1507842229451-9f7a177ce533?auto=format&fit=crop&w=1200&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-booknook-text/95 via-booknook-text/75 to-booknook-text/40" />

          {/* Top Brand Mark */}
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <span className="flex h-9 w-9 items-center justify-center rounded-xs bg-booknook-accent text-booknook-bg shadow-xs transition-transform group-hover:scale-105">
                <BookOpen className="h-4 w-4" />
              </span>
              <div className="flex flex-col">
                <span className="font-serif text-lg tracking-wide font-semibold text-white">
                  BookNook
                </span>
                <span className="text-[10px] tracking-widest uppercase text-booknook-accent">
                  Lending Library
                </span>
              </div>
            </Link>
          </div>

          {/* Center Quote & Literary Atmosphere */}
          <div className="relative z-10 my-auto py-8">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-booknook-accent/40 bg-booknook-accent/20 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-booknook-secondary">
              <Sparkles className="h-3 w-3 text-booknook-accent" />
              Welcome Back
            </div>
            <Quote className="h-6 w-6 text-booknook-accent/60 mb-2" />
            <blockquote className="font-serif text-xl xl:text-2xl font-light italic leading-relaxed text-white/95">
              &ldquo;A room without books is like a body without a soul.&rdquo;
            </blockquote>
            <p className="mt-3 text-xs uppercase tracking-widest text-booknook-secondary/70 font-sans">
              — Marcus Tullius Cicero
            </p>
          </div>

          {/* Bottom Community Note */}
          <div className="relative z-10 border-t border-white/10 pt-4 text-xs text-white/70 leading-relaxed">
            <p>
              Revisit your borrowed shelves, rediscover saved literature, and enjoy the quiet joy of reading.
            </p>
          </div>
        </div>

        {/* Right Column: Sign In Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          {/* Mobile Brand Header */}
          <div className="flex lg:hidden items-center justify-between pb-6 mb-6 border-b border-booknook-border">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xs bg-booknook-accent text-booknook-bg">
                <BookOpen className="h-4 w-4" />
              </span>
              <span className="font-serif text-base tracking-wide font-bold text-booknook-text">
                BookNook
              </span>
            </Link>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-booknook-accent">
              Sign In
            </span>
          </div>

          {/* Form Header */}
          <div className="mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-booknook-accent">
              Reader Access
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-booknook-text mt-1.5">
              Sign In to Your Account
            </h1>
            <p className="text-sm text-booknook-text/70 mt-2 leading-relaxed">
              Enter your credentials below to access your personal shelf and active borrows.
            </p>
          </div>

          {/* Social Sign In Button */}
          <Button
            type="button"
            variant="outline"
            disabled={loading || googleLoading}
            onClick={handleGoogleSignIn}
            className="w-full h-11 border-booknook-border bg-booknook-white text-booknook-text hover:bg-booknook-secondary/50 hover:border-booknook-accent/60 active:scale-[0.99] transition-all rounded-xs text-xs uppercase tracking-wider font-medium shadow-2xs"
          >
            {googleLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-booknook-accent" />
                Connecting to Google...
              </>
            ) : (
              <>
                <svg className="mr-2.5 h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-booknook-border" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
              <span className="bg-booknook-white px-3 text-booknook-text/50 font-medium">
                or sign in with email
              </span>
            </div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs uppercase tracking-wider font-semibold text-booknook-text/80"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="reader@booknook.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-10 border-booknook-border bg-booknook-bg/40 focus-visible:border-booknook-accent focus-visible:ring-1 focus-visible:ring-booknook-accent text-booknook-text text-sm rounded-xs placeholder:text-booknook-text/40 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-xs uppercase tracking-wider font-semibold text-booknook-text/80"
                >
                  Password
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-10 pr-10 border-booknook-border bg-booknook-bg/40 focus-visible:border-booknook-accent focus-visible:ring-1 focus-visible:ring-booknook-accent text-booknook-text text-sm rounded-xs placeholder:text-booknook-text/40 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-booknook-text/50 hover:text-booknook-text transition-colors focus:outline-none focus-visible:text-booknook-accent"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full h-11 bg-booknook-accent text-booknook-bg hover:bg-booknook-accent/90 active:scale-[0.99] transition-all rounded-xs text-xs uppercase tracking-widest font-semibold shadow-xs mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Footer Registration Link */}
          <div className="mt-8 pt-6 border-t border-booknook-border text-center text-xs text-booknook-text/70">
            Don&apos;t have an account yet?&nbsp;
            <Link
              href={registerHref}
              className="font-semibold text-booknook-accent hover:text-booknook-accent/90 underline-offset-4 hover:underline transition-colors"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center bg-booknook-bg">
          <Loader2 className="h-8 w-8 animate-spin text-booknook-accent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
