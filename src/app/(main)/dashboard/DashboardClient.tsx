"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, LogOut, Shield } from "lucide-react";

type DashboardClientProps = {
  name: string;
  positionName: string;
  bidangName: string;
  roles: string[];
  isSuperAdmin: boolean;
};

function formatRoleLabel(role: string) {
  // "APPROVAL_1" -> "approval 1", "SUPER_ADMIN" -> "super admin"
  return role
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b(\d+)/g, " $1")
    .trim();
}

function hasRole(roles: string[], needed: string) {
  return roles.includes(needed);
}

export default function DashboardClient({
  name,
  positionName,
  bidangName,
  roles,
  isSuperAdmin,
}: DashboardClientProps) {
  const router = useRouter();

  const { dayName, dayNumber, monthName, year } = useMemo(() => {
    const now = new Date();
    const dayName = now.toLocaleDateString("id-ID", { weekday: "long" });
    const dayNumber = now.getDate();
    const monthName = now
      .toLocaleDateString("en-US", { month: "short" })
      .toUpperCase();
    const year = now.getFullYear();

    return { dayName, dayNumber, monthName, year };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });
    } catch (e) {
      console.error(e);
    } finally {
      router.push("/login");
    }
  };

  const initials = useMemo(
    () =>
      name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    [name]
  );

  const canCreate = hasRole(roles, "CREATOR");

  return (
    <div className="min-h-screen flex bg-[#262626] text-white">
      {/* SIDEBAR KIRI */}
      <aside className="w-24 bg-[#1f1f1f] border-r border-[#42ff6b] flex flex-col items-center justify-between py-8">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#42ff6b] flex items-center justify-center text-black font-semibold">
            {initials}
          </div>
        </div>

        {/* Menu tengah */}
        <div className="flex flex-col items-center gap-10">
          {/* Create → hanya kalau punya role CREATOR */}
          {canCreate && (
            <button className="flex flex-col items-center gap-2 text-xs">
              <div className="w-10 h-10 rounded-full border-2 border-[#42ff6b] flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <span>create</span>
            </button>
          )}

          {/* Search → boleh semua user */}
          <button className="flex flex-col items-center gap-2 text-xs">
            <div className="w-10 h-10 rounded-full border-2 border-[#42ff6b] flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <span>search</span>
          </button>

          {/* Admin → hanya SUPER_ADMIN */}
          {isSuperAdmin && (
            <button
              onClick={() => router.push("/admin")}
              className="flex flex-col items-center gap-2 text-xs"
            >
              <div className="w-10 h-10 rounded-full border-2 border-[#42ff6b] flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <span>admin</span>
            </button>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-2 text-xs"
          >
            <div className="w-10 h-10 rounded-full border-2 border-[#42ff6b] flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <span>logout</span>
          </button>
        </div>

        <div className="h-10" />
      </aside>

      {/* KONTEN UTAMA */}
      <main className="flex-1 flex flex-col px-10 md:px-24 py-10 relative">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-1.5 bg-[#42ff6b] rounded-full" />
              <span className="text-lg">Selamat Datang,</span>
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-semibold leading-snug">
                {name}
                <br />
                {positionName}
              </h1>
              <p className="text-sm text-gray-300">{bidangName}</p>
            </div>
          </div>

          <div className="text-right leading-tight text-xl md:text-2xl font-semibold">
            <div>
              {dayName}, {dayNumber}
            </div>
            <div>{monthName}</div>
            <div>{year}</div>
          </div>
        </div>

        <div className="mt-auto pt-10">
          <p className="text-lg mb-4">Account Role :</p>
          <div className="flex flex-wrap gap-4">
            {roles.map((role) => (
              <span
                key={role}
                className="px-6 py-2 rounded-full border border-[#42ff6b] text-sm"
              >
                {formatRoleLabel(role)}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
