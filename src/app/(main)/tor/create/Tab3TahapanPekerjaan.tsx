"use client";

import { TabProps } from "./types";
import RichTextEditor from "./components/RichTextEditor";

export default function Tab3TahapanPekerjaan({ formData, onChange }: TabProps) {
  const handleInputChange = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 bg-blue-100 px-4 py-2 rounded">
        Tahapan Pekerjaan
      </h2>

      {/* Jangka Waktu Pelaksanaan */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Jangka Waktu Pelaksanaan
        </label>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            value={formData.duration || ""}
            onChange={(e) => handleInputChange("duration", parseInt(e.target.value))}
            placeholder="Jumlah"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={formData.durationUnit || "days"}
            onChange={(e) => handleInputChange("durationUnit", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="days">Hari Kalender</option>
            <option value="weeks">Minggu</option>
            <option value="months">Bulan</option>
          </select>
        </div>
      </div>

      {/* Spesifikasi Teknis */}
      <RichTextEditor
        label="Spesifikasi Teknis"
        content={formData.technicalSpec}
        onChange={(html) => handleInputChange("technicalSpec", html)}
        placeholder="Detail spesifikasi teknis pekerjaan..."
      />

      {/* Ketentuan Umum */}
      <RichTextEditor
        label="Ketentuan Umum"
        content={formData.generalProvisions}
        onChange={(html) => handleInputChange("generalProvisions", html)}
        placeholder="Ketentuan umum pelaksanaan pekerjaan..."
      />

      {/* Titik Serah Terima */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Titik Serah Terima
        </label>
        <textarea
          value={formData.deliveryPoint || ""}
          onChange={(e) => handleInputChange("deliveryPoint", e.target.value)}
          placeholder="Lokasi serah terima pekerjaan..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Mekanisme Serah Terima */}
      <RichTextEditor
        label="Mekanisme Serah Terima"
        content={formData.deliveryMechanism}
        onChange={(html) => handleInputChange("deliveryMechanism", html)}
        placeholder="Prosedur dan persyaratan serah terima..."
      />
    </div>
  );
}

