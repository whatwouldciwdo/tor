import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body as { username?: string; password?: string };

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        position: {
          include: {
            bidang: true,
            positionRoles: {
              include: { role: true },
            },
          },
        },
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { message: "Username atau password tidak valid" },
        { status: 401 }
      );
    }

    const passwordOk = await bcrypt.compare(password, user.passwordHash);
    if (!passwordOk) {
      return NextResponse.json(
        { message: "Username atau password tidak valid" },
        { status: 401 }
      );
    }

    // Buat token (keep email for notifications)
    const token = jwt.sign(
      {
        sub: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        positionId: user.positionId,
        isSuperAdmin: user.isSuperAdmin,
      },
      JWT_SECRET,
      { expiresIn: "1d" } // 1 hari
    );

    const res = NextResponse.json({ message: "Login berhasil" });

    // set cookie httpOnly
    res.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 hari
      path: "/",
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat login" },
      { status: 500 }
    );
  }
}
