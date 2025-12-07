"use client";

import { useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Plus, Search, LogOut, Shield, FileText } from "lucide-react";
import ProfileModal from "@/components/ProfileModal";

type SidebarProps = {
  userName: string;
  userEmail?: string;
  userUsername?: string;
  userPosition?: string;
  userBidang?: string;
  isSuperAdmin: boolean;
  canCreate?: boolean;
};

export default function Sidebar({ 
  userName, 
  userEmail = "",
  userUsername = "",
  userPosition = "",
  userBidang = "",
  isSuperAdmin, 
  canCreate = true 
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userName,
    username: userUsername,
    email: userEmail,
    position: userPosition,
    bidang: userBidang,
  });

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

  const handleProfileUpdate = async (data: { email?: string; currentPassword?: string; newPassword?: string }) => {
    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update profile");
    }

    const result = await response.json();
    
    // Update local profile data
    setProfileData({
      name: result.user.name,
      username: result.user.username,
      email: result.user.email,
      position: result.user.position?.name || "",
      bidang: result.user.position?.bidang?.name || "",
    });
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
    <>
    <aside className="fixed left-0 top-0 h-screen w-24 bg-[#1f1f1f] border-r border-[#42ff6b] flex flex-col items-center justify-between py-8 flex-shrink-0 overflow-y-auto z-50">
      {/* Logo */}
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="w-16 h-16">
          <Image
            src="/pln-tos-logo.jpg"
            alt="TOS Logo"
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
        
        {/* Avatar */}
        <div className="flex flex-col items-center">
          {pathname === "/tor" ? (
            <button
              onClick={() => setShowProfileModal(true)}
              className="w-14 h-14 rounded-full bg-[#42ff6b] flex items-center justify-center text-black font-semibold text-lg hover:bg-[#38e05c] hover:scale-110 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[#42ff6b]/50"
              title="Profile Settings"
            >
              {initials}
            </button>
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#42ff6b] flex items-center justify-center text-black font-semibold text-lg">
              {initials}
            </div>
          )}
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
                className={`flex flex-col items-center gap-2 text-xs transition-all duration-300 group ${
                  item.active
                    ? "text-[#42ff6b]"
                    : "text-white hover:text-[#42ff6b] hover:-translate-y-1"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    item.active
                      ? "border-2 border-[#42ff6b] bg-[#42ff6b]/10 shadow-lg shadow-[#42ff6b]/50"
                      : "border-2 border-[#42ff6b] group-hover:bg-[#42ff6b]/20 group-hover:shadow-lg group-hover:shadow-[#42ff6b]/50 group-hover:scale-110"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="group-hover:font-semibold transition-all duration-300">{item.label}</span>
              </button>
            )
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-2 text-xs text-white hover:text-red-400 hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="w-10 h-10 rounded-full border-2 border-[#42ff6b] group-hover:border-red-400 group-hover:bg-red-500/20 group-hover:shadow-lg group-hover:shadow-red-400/50 group-hover:scale-110 flex items-center justify-center transition-all duration-300">
            <LogOut className="w-5 h-5" />
          </div>
          <span className="group-hover:font-semibold transition-all duration-300">logout</span>
        </button>
      </div>

      <div className="h-10" />
    </aside>
    
    {/* Profile Modal */}
    <ProfileModal
      isOpen={showProfileModal}
      onClose={() => setShowProfileModal(false)}
      userData={profileData}
      onUpdate={handleProfileUpdate}
    />
  </>
  );
}
