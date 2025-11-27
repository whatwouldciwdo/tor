"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTorForm({ userId, bidangList }) {
  const router = useRouter();

  const [judul, setJudul] = useState("");
  const [bidangId, setBidangId] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("/tor/create/api", {
      method: "POST",
      body: JSON.stringify({ judul, bidangId, creatorId: userId }),
    });

    const data = await res.json();
    router.push(`/tor/${data.id}/tahapan`);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block mb-1 text-sm">Judul TOR</label>
        <input
          className="w-full px-3 py-2 rounded bg-[#333] text-white"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-sm">Bidang</label>
        <select
          className="w-full px-3 py-2 rounded bg-[#333] text-white"
          value={bidangId}
          onChange={(e) => setBidangId(e.target.value)}
          required
        >
          <option value="">-- pilih bidang --</option>
          {bidangList.map((b) => (
            <option key={b.id} value={b.id}>
              {b.namaBidang}
            </option>
          ))}
        </select>
      </div>

      <button className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">
        Simpan TOR
      </button>
    </form>
  );
}
