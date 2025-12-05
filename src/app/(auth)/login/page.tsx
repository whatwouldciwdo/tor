"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("officer.outage@tor.local");
  const [password, setPassword] = useState("officer123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Login gagal");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan jaringan");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-[#181f21] text-white">
      {/* Panel kiri (gambar) */}
      <section className="relative hidden md:block w-[35%] max-w-md">
        <Image
          src="/login-bg.jpg"
          alt="Login background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-y-0 right-0 w-[2px] bg-[#42ff6b]" />
        <div className="absolute inset-y-0 left-0 flex items-center">
          <p className="ml-10 text-5xl font-semibold tracking-[0.2em] [writing-mode:vertical-rl] rotate-180">
            Login
          </p>
        </div>
      </section>

      {/* Panel kanan (form) */}
      <section className="flex-1 flex items-center justify-center px-6 md:px-16">
        <div className="w-full max-w-md space-y-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold">
              [TOS] Tor Online System
            </h1>
            <p className="mt-3 text-lg text-gray-300">
              Let&apos;s log you in quickly
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-md border border-[#42ff6b] bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#42ff6b] focus:border-transparent placeholder:text-gray-400"
                style={{ color: 'white' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-md border border-[#42ff6b] bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#42ff6b] focus:border-transparent placeholder:text-gray-400"
                style={{ color: 'white' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400">
                {error}
              </p>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#42ff6b] px-4 py-3 text-sm font-semibold text-black hover:bg-[#39e05d] transition disabled:opacity-60"
              >
                {loading ? "Logging in..." : "LOGIN"}
              </button>
            </div>
          </form>

          <div className="flex flex-col items-center gap-1 text-sm md:flex-row md:justify-end md:gap-2">
            <span className="text-gray-300">don&apos;t have an account?</span>
            <button type="button" className="text-[#42ff6b] hover:underline">
              Please Contact Administrator
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
