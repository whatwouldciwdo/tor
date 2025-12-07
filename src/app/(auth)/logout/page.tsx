"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Call logout API
        await fetch("/api/logout", {
          method: "POST",
        });
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        // Always redirect to login, even if API call fails
        router.push("/login");
      }
    };

    performLogout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#181f21] text-white">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#42ff6b] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-lg text-gray-400">Logging out...</p>
      </div>
    </div>
  );
}
