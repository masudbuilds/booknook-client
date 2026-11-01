import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json({ message: "JWT secret not configured" }, { status: 500 });
    }

    const payload = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: "7d" });

    return NextResponse.json({ token, user: payload });
  } catch (error) {
    return NextResponse.json({ message: "Failed to generate token" }, { status: 500 });
  }
}
