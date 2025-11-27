"use client";

import { TabProps } from "./types";
import RichTextEditor from "./components/RichTextEditor";

export default function Tab2Pendahuluan({ formData, onChange }: TabProps) {
  const handleInputChange = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 bg-blue-100 px-4 py-2 rounded">
        Pendahuluan
      </h2>

      {/* Judul Pekerjaan */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Judul Pekerjaan <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title || ""}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="Masukkan judul pekerjaan"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      {/* Cover Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cover Image (Opsional)
        </label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const formData = new FormData();
              formData.append("file", file);

              try {
                const res = await fetch("/api/upload", {
                  method: "POST",
                  body: formData,
                });
                
                if (!res.ok) throw new Error("Upload failed");
                
                const data = await res.json();
                handleInputChange("coverImage", data.url);
              } catch (error) {
                console.error("Upload error:", error);
                alert("Failed to upload image");
              }
            }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {formData.coverImage && (
            <div className="relative w-20 h-20 border rounded overflow-hidden">
              <img 
                src={formData.coverImage} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleInputChange("coverImage", null)}
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl text-xs"
              >
                X
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pendahuluan */}
      <RichTextEditor
        label="Pendahuluan"
        content={formData.introduction}
        onChange={(html) => handleInputChange("introduction", html)}
        placeholder="Jelaskan pendahuluan pekerjaan ini..."
      />

      {/* Latar Belakang */}
      <RichTextEditor
        label="Latar Belakang"
        required
        content={formData.background}
        onChange={(html) => handleInputChange("background", html)}
        placeholder="Jelaskan latar belakang pekerjaan ini..."
      />

      {/* Tujuan */}
      <RichTextEditor
        label="Tujuan"
        required
        content={formData.objective}
        onChange={(html) => handleInputChange("objective", html)}
        placeholder="Jelaskan tujuan dari pekerjaan ini..."
      />

      {/* Ruang Lingkup */}
      <RichTextEditor
        label="Ruang Lingkup Pekerjaan"
        required
        content={formData.scope}
        onChange={(html) => handleInputChange("scope", html)}
        placeholder="Jelaskan ruang lingkup pekerjaan secara detail..."
      />

      {/* Deskripsi Tambahan */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Deskripsi Tambahan (Opsional)
        </label>
        <textarea
          value={formData.description || ""}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Informasi tambahan jika diperlukan"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}
