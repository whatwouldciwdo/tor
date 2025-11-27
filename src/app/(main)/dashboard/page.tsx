// src/app/(main)/dashboard/page.tsx
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function DashboardPage() {
  // NEXT 16: cookies() sekarang async → harus di-await
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#262626] text-white">
        <p>Session tidak ditemukan. Silakan login kembali.</p>
      </div>
    );
  }

  let email: string | undefined;
  let isSuperAdminFromToken = false;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & {
      email?: string;
      isSuperAdmin?: boolean;
    };
    email = decoded.email;
    isSuperAdminFromToken = !!decoded.isSuperAdmin;
  } catch (e) {
    console.error("JWT verify error:", e);
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#262626] text-white">
        <p>Sesi tidak valid. Silakan login ulang.</p>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#262626] text-white">
        <p>Data user tidak lengkap di token. Silakan login ulang.</p>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
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

  if (!user || !user.position) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#262626] text-white">
        <p>User atau jabatan tidak ditemukan. Hubungi administrator.</p>
      </div>
    );
  }

  const roles = user.position.positionRoles.map((pr) => pr.role.name);
  const bidangName = user.position.bidang?.name ?? "Tidak ada bidang";

  // Super admin kalau flag di user true atau punya role SUPER_ADMIN
  const isSuperAdmin = user.isSuperAdmin || isSuperAdminFromToken || roles.includes("SUPER_ADMIN");

  return (
    <DashboardClient
      name={user.name}
      positionName={user.position.name}
      bidangName={bidangName}
      roles={roles}
      isSuperAdmin={isSuperAdmin}
    />
  );
}
