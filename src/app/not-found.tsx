"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#181f21] text-white px-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/pln-tos-logo.jpg"
            alt="TOR Logo"
            width={120}
            height={120}
            className="object-contain opacity-80"
          />
        </div>

        {/* 404 Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <FileQuestion className="w-32 h-32 text-[#42ff6b] opacity-20" strokeWidth={1} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl md:text-9xl font-bold text-[#42ff6b] opacity-30">404</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Page Not Found
          </h1>
          <p className="text-xl text-gray-400">
            Oops! Halaman yang Anda cari tidak ditemukan
          </p>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Halaman mungkin telah dipindahkan, dihapus, atau URL yang Anda masukkan salah.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Link
            href="/tor"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#42ff6b] text-black rounded-lg hover:bg-[#38e05c] transition-all font-medium shadow-lg shadow-[#42ff6b]/20 hover:shadow-[#42ff6b]/40 hover:scale-105 duration-300"
          >
            <Home size={20} />
            Kembali ke Dashboard
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#42ff6b] text-[#42ff6b] rounded-lg hover:bg-[#42ff6b]/10 transition-all font-medium hover:scale-105 duration-300"
          >
            <ArrowLeft size={20} />
            Halaman Sebelumnya
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="pt-12 space-y-2">
          <div className="w-32 h-1 bg-[#42ff6b] mx-auto rounded-full opacity-30"></div>
          <p className="text-xs text-gray-600">
            TOR Online System © 2025
          </p>
        </div>
      </div>
    </div>
  );
}
