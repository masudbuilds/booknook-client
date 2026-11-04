"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useSession } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, User } from "lucide-react";

function ProfileContent() {
  const { data: session } = useSession();

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
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <Card className="border-booknook-border bg-booknook-white shadow-sm">
        <CardHeader className="text-center">
          <Avatar className="mx-auto h-20 w-20 border-2 border-booknook-accent">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback className="bg-booknook-text text-lg font-semibold text-booknook-bg">
              {getInitials(session?.user?.name)}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="mt-4 font-serif text-2xl font-bold text-booknook-text">
            {session?.user?.name || "Library Reader"}
          </CardTitle>
          <CardDescription className="text-booknook-text/60">
            BookNook Library Member
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-lg border border-booknook-border bg-booknook-secondary/20 p-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-booknook-accent shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-booknook-text/60">Full Name</p>
                <p className="text-sm font-semibold text-booknook-text truncate">{session?.user?.name || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-booknook-border bg-booknook-secondary/20 p-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-booknook-accent shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-booknook-text/60">Email Address</p>
                <p className="text-sm font-semibold text-booknook-text truncate">{session?.user?.email || "N/A"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

