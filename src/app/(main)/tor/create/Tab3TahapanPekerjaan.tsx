"use client";

import { TabProps } from "./types";
import TiptapEditor from "./components/TiptapEditor";
import GanttTableEditor from "./components/GanttTableEditor";

export default function Tab3TahapanPekerjaan({ formData, onChange, isEditing = false }: TabProps) {
  const handleInputChange = (field: string, value: any) => {
    if (!isEditing) return; // Prevent changes when not editing
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 bg-blue-100 px-4 py-2 rounded">
        Tahapan Pekerjaan
      </h2>

      {/* Work Stages Gantt Table */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Jadwal Tahapan Pekerjaan <span className="text-red-500">*</span>
        </label>
        <GanttTableEditor
          data={formData.workStages}
          onChange={(data) => handleInputChange("workStages", data)}
          isEditing={isEditing}
        />
      </div>

      {/* Table Explanation */}
      <TiptapEditor
        label="Penjelasan Tabel (Opsional)"
        content={formData.workStagesExplanation}
        onChange={(html) => handleInputChange("workStagesExplanation", html)}
        placeholder="Tambahkan penjelasan mengenai tahapan pekerjaan jika diperlukan..."
        readOnly={!isEditing}
      />

      {/* Persyaratan Pengiriman */}
      <TiptapEditor
        label="Persyaratan Pengiriman"
        content={formData.deliveryRequirements}
        onChange={(html) => handleInputChange("deliveryRequirements", html)}
        placeholder="Jelaskan persyaratan pengiriman hasil pekerjaan..."
        readOnly={!isEditing}
      />

      {/* Titik Serah Terima */}
      <TiptapEditor
        label="Titik Serah Terima"
        content={formData.handoverPoint}
        onChange={(html) => handleInputChange("handoverPoint", html)}
        placeholder="Jelaskan titik/lokasi serah terima hasil pekerjaan..."
        readOnly={!isEditing}
      />

      {/* Mekanisme Serah Terima */}
      <TiptapEditor
        label="Mekanisme Serah Terima"
        content={formData.handoverMechanism}
        onChange={(html) => handleInputChange("handoverMechanism", html)}
        placeholder="Jelaskan prosedur dan mekanisme serah terima hasil pekerjaan..."
        readOnly={!isEditing}
      />
    </div>
  );
}
