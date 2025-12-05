"use client";

import { useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Plus, Search, LogOut, Shield, FileText } from "lucide-react";

type SidebarProps = {
  userName: string;
  isSuperAdmin: boolean;
  canCreate?: boolean;
};

export default function Sidebar({ userName, isSuperAdmin, canCreate = true }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const initials = useMemo(
    () =>
      userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    [userName]
  );

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

  const menuItems = [
    {
      id: "create",
      label: "create",
      icon: Plus,
      onClick: () => router.push("/tor/create"),
      show: canCreate,
    },
    {
      id: "tors",
      label: "TORs",
      icon: FileText,
      onClick: () => router.push("/tor"),
      show: true,
      active: pathname?.startsWith("/tor"),
    },
    {
      id: "search",
      label: "search",
      icon: Search,
      onClick: () => {}, // TODO: Implement search modal
      show: true,
    },
    {
      id: "admin",
      label: "admin",
      icon: Shield,
      onClick: () => router.push("/admin"),
      show: isSuperAdmin,
    },
  ];

  return (
    <aside className="w-24 bg-[#1f1f1f] border-r border-[#42ff6b] flex flex-col items-center justify-between py-8 flex-shrink-0">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-[#42ff6b] flex items-center justify-center text-black font-semibold text-lg">
          {initials}
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col items-center gap-10">
        {menuItems.map(
          (item) =>
            item.show && (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`flex flex-col items-center gap-2 text-xs transition-all ${
                  item.active
                    ? "text-[#42ff6b]"
                    : "text-white hover:text-[#42ff6b]"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    item.active
                      ? "border-2 border-[#42ff6b] bg-[#42ff6b]/10"
                      : "border-2 border-[#42ff6b]"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                </div>
                <span>{item.label}</span>
              </button>
            )
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-2 text-xs text-white hover:text-[#42ff6b] transition-all"
        >
          <div className="w-10 h-10 rounded-full border-2 border-[#42ff6b] flex items-center justify-center">
            <LogOut className="w-5 h-5" />
          </div>
          <span>logout</span>
        </button>
      </div>

      <div className="h-10" />
    </aside>
  );
}
