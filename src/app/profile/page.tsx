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
      <Card className="border-stone-200 bg-[#FDFBF7] shadow-sm">
        <CardHeader className="text-center">
          <Avatar className="mx-auto h-20 w-20 border-2 border-stone-300">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback className="bg-[#1C3F3A] text-lg font-semibold text-white">
              {getInitials(session?.user?.name)}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="mt-4 font-serif text-2xl font-bold text-[#1C3F3A]">
            {session?.user?.name || "Library Reader"}
          </CardTitle>
          <CardDescription className="text-stone-500">
            BookNook Library Member
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-lg border border-stone-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-stone-400" />
              <div>
                <p className="text-xs font-medium text-stone-500">Full Name</p>
                <p className="text-sm font-semibold text-stone-800">{session?.user?.name || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-stone-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-stone-400" />
              <div>
                <p className="text-xs font-medium text-stone-500">Email Address</p>
                <p className="text-sm font-semibold text-stone-800">{session?.user?.email || "N/A"}</p>
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

