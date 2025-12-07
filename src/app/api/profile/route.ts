import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET!;

// Helper to get current user from token
async function getCurrentUser(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const decoded = jwt.verify(token, JWT_SECRET) as any;
  const user = await prisma.user.findUnique({
    where: { id: decoded.sub },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

// PUT /api/profile - Update user profile (email and/or password)
export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    const body = await req.json();
    
    const { email, currentPassword, newPassword } = body;

    // Validate input
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const updateData: any = { email };

    // If changing password
    if (currentPassword && newPassword) {
      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
      
      if (!isPasswordValid) {
        return NextResponse.json(
          { message: "Current password is incorrect" },
          { status: 400 }
        );
      }

      // Validate new password length
      if (newPassword.length < 6) {
        return NextResponse.json(
          { message: "New password must be at least 6 characters" },
          { status: 400 }
        );
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.passwordHash = hashedPassword;
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        position: {
          select: {
            name: true,
            bidang: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}

// GET /api/profile - Get current user profile
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);

    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        position: {
          select: {
            name: true,
            bidang: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to get profile" },
      { status: 500 }
    );
  }
}
