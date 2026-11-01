"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { BookOpen, Check, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";

import { signUp, signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallback = searchParams.get("callbackUrl");
  const callbackUrl =
    rawCallback && rawCallback.startsWith("/") && !rawCallback.startsWith("//")
      ? rawCallback
      : "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;
  const isPasswordValid = hasUpper && hasLower && hasMinLength;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (!isPasswordValid) {
      toast.error("Password must be at least 6 characters with uppercase and lowercase letters");
      return;
    }

    setLoading(true);
    try {
      const res = await signUp.email({
        name,
        email,
        password,
        image: photoUrl.trim() || undefined,
      });

      if (res.error) {
        toast.error(res.error.message || "Failed to register account");
        setLoading(false);
        return;
      }

      toast.success("Account registered successfully! Please log in.");
      router.push(`/login${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`);
    } catch {
      toast.error("An unexpected error occurred during registration");
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

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-stone-200 bg-[#FDFBF7] shadow-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-[#1C3F3A] text-white">
            <BookOpen className="h-5 w-5" />
          </div>
          <CardTitle className="font-serif text-2xl font-bold text-[#1C3F3A]">
            Join BookNook
          </CardTitle>
          <CardDescription className="text-stone-500">
            Create your account to start borrowing and sharing books.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-stone-700">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Jane Reader"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-stone-300 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-stone-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-stone-300 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="photoUrl" className="text-stone-700">Photo URL (Optional)</Label>
              <Input
                id="photoUrl"
                type="url"
                placeholder="https://images.example.com/avatar.jpg"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="border-stone-300 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-stone-700">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-stone-300 bg-white"
              />
              <div className="mt-1 space-y-1 text-xs text-stone-600">
                <div className="flex items-center gap-1.5">
                  {hasMinLength ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <X className="h-3.5 w-3.5 text-stone-400" />
                  )}
                  <span className={hasMinLength ? "text-emerald-700" : ""}>At least 6 characters</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {hasUpper ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <X className="h-3.5 w-3.5 text-stone-400" />
                  )}
                  <span className={hasUpper ? "text-emerald-700" : ""}>At least one uppercase letter</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {hasLower ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <X className="h-3.5 w-3.5 text-stone-400" />
                  )}
                  <span className={hasLower ? "text-emerald-700" : ""}>At least one lowercase letter</span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-[#1C3F3A] text-white hover:bg-[#15302C]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#FDFBF7] px-2 text-stone-400">or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={loading || googleLoading}
            onClick={handleGoogleSignIn}
            className="w-full border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
          >
            {googleLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting to Google...
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
                Sign up with Google
              </>
            )}
          </Button>
        </CardContent>

        <CardFooter className="justify-center border-t border-stone-200/60 pt-4 text-sm text-stone-600">
          Already have an account?&nbsp;
          <Link
            href={`/login${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
            className="font-medium text-[#C86244] hover:underline"
          >
            Sign in here
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#1C3F3A]" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}

