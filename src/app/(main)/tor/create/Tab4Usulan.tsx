"use client";

import { TabProps } from "./types";
import BudgetTable from "./components/BudgetTable";
import RichTextEditor from "./components/RichTextEditor";

export default function Tab4Usulan({ formData, onChange }: TabProps) {
  const handleInputChange = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 bg-blue-100 px-4 py-2 rounded">
        Usulan
      </h2>

      {/* Usulan Pelaksana Direksi Pekerjaan */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Usulan Pelaksana Direksi Pekerjaan
        </label>
        <textarea
          value={formData.directorProposal || ""}
          onChange={(e) => handleInputChange("directorProposal", e.target.value)}
          placeholder="Nama jabatan Direksi Pekerjaan..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Usulan Direksi Lapangan */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Usulan Direksi Lapangan
        </label>
        <textarea
          value={formData.fieldDirectorProposal || ""}
          onChange={(e) => handleInputChange("fieldDirectorProposal", e.target.value)}
          placeholder="Nama jabatan Direksi Lapangan..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Persyaratan Calon Penyedia */}
      <RichTextEditor
        label="Persyaratan Calon Penyedia"
        content={formData.vendorRequirements}
        onChange={(html) => handleInputChange("vendorRequirements", html)}
        placeholder="Persyaratan izin usaha, klasifikasi, sertifikat, dll..."
      />

      {/* Usulan Metode Pengadaan */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Usulan Metode Pengadaan
        </label>
        <input
          type="text"
          value={formData.procurementMethod || ""}
          onChange={(e) => handleInputChange("procurementMethod", e.target.value)}
          placeholder="Metode pengadaan..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Usulan Aturan Pembayaran */}
      <RichTextEditor
        label="Usulan Aturan Pembayaran"
        content={formData.paymentTerms}
        onChange={(html) => handleInputChange("paymentTerms", html)}
        placeholder="Aturan pembayaran, mata uang, persyaratan..."
      />

      {/* Usulan Aturan Denda */}
      <RichTextEditor
        label="Usulan Aturan Denda"
        content={formData.penaltyRules}
        onChange={(html) => handleInputChange("penaltyRules", html)}
        placeholder="Denda keterlambatan, batasan maksimal, dll..."
      />

      {/* Rencana Anggaran Biaya (RAB) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rencana Anggaran Biaya (RAB)
        </label>
        <BudgetTable formData={formData} onChange={onChange} />
      </div>

      {/* Persyaratan Lainnya */}
      <RichTextEditor
        label="Persyaratan Lainnya"
        content={formData.otherRequirements}
        onChange={(html) => handleInputChange("otherRequirements", html)}
        placeholder="Persyaratan tambahan lainnya..."
      />
    </div>
  );
}

