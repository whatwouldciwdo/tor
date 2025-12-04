"use client";

import { TabProps, ApprovalSignature } from "./types";
import { Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";

interface Tab5Props extends TabProps {
  bidangId?: number;
  creatorName?: string;
  creatorPosition?: string;
  torId?: number;
}

export default function Tab5LembarPengesahan({ 
  formData, 
  onChange, 
  isEditing = false,
  bidangId,
  creatorName,
  creatorPosition,
  torId,
}: Tab5Props) {
  const [workflowSteps, setWorkflowSteps] = useState<any[]>([]);
  const [isLoadingWorkflow, setIsLoadingWorkflow] = useState(false);

  // Fetch workflow steps when component mounts
  useEffect(() => {
    if (bidangId && torId) {
      fetchWorkflowSteps();
    }
  }, [bidangId, torId]);

  const fetchWorkflowSteps = async () => {
    if (!bidangId) return;
    
    setIsLoadingWorkflow(true);
    try {
      const response = await fetch(`/api/workflow?bidangId=${bidangId}`);
      if (response.ok) {
        const data = await response.json();
        setWorkflowSteps(data.steps || []);
      }
    } catch (error) {
      console.error("Failed to fetch workflow:", error);
    } finally {
      setIsLoadingWorkflow(false);
    }
  };

  // Initialize approval signatures if empty
  useEffect(() => {
    if (!formData.approvalSignatures || formData.approvalSignatures.length === 0) {
      // Auto-populate default signatures
      const defaultSignatures: ApprovalSignature[] = [];
      
      // 1. Dibuat oleh (creator)
      defaultSignatures.push({
        id: uuidv4(),
        role: "Dibuat oleh",
        name: creatorName || "",
        position: creatorPosition || "",
        date: formData.creationDate || new Date().toISOString().split("T")[0],
      });

      // 2-3. Diperiksa/Disetujui oleh from workflow
      if (workflowSteps.length > 0) {
        // First step: Diperiksa oleh
        if (workflowSteps[0]) {
          defaultSignatures.push({
            id: uuidv4(),
            role: "Diperiksa oleh",
            name: workflowSteps[0].user?.name || "", // Auto-fill from user
            position: workflowSteps[0].position?.name || workflowSteps[0].label || "",
            date: "",
          });
        }
        
        // Second step: Disetujui oleh  
        if (workflowSteps[1]) {
          defaultSignatures.push({
            id: uuidv4(),
            role: "Disetujui oleh",
            name: workflowSteps[1].user?.name || "", // Auto-fill from user
            position: workflowSteps[1].position?.name || workflowSteps[1].label || "",
            date: "",
          });
        }

        // Additional steps
        for (let i = 2; i < workflowSteps.length; i++) {
          defaultSignatures.push({
            id: uuidv4(),
            role: "Disetujui oleh",
            name: workflowSteps[i].user?.name || "", // Auto-fill from user
            position: workflowSteps[i].position?.name || workflowSteps[i].label || "",
            date: "",
          });
        }
      } else {
        // Fallback if no workflow
        defaultSignatures.push({
          id: uuidv4(),
          role: "Diperiksa oleh",
          name: "",
          position: "",
          date: "",
        });
        defaultSignatures.push({
          id: uuidv4(),
          role: "Disetujui oleh",
          name: "",
          position: "",
          date: "",
        });
      }

      onChange({ approvalSignatures: defaultSignatures });
    }
  }, [workflowSteps, creatorName, creatorPosition, formData.creationDate]);

  const signatures = formData.approvalSignatures || [];

  const addSignature = () => {
    if (!isEditing) return;
    const newSignature: ApprovalSignature = {
      id: uuidv4(),
      role: "Disetujui oleh",
      name: "",
      position: "",
      date: "",
    };
    onChange({ approvalSignatures: [...signatures, newSignature] });
  };

  const updateSignature = (id: string, field: keyof ApprovalSignature, value: string) => {
    if (!isEditing) return;
    const updated = signatures.map((sig) =>
      sig.id === id ? { ...sig, [field]: value } : sig
    );
    onChange({ approvalSignatures: updated });
  };

  const removeSignature = (id: string) => {
    if (!isEditing) return;
    const updated = signatures.filter((sig) => sig.id !== id);
    onChange({ approvalSignatures: updated });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 bg-blue-100 px-4 py-2 rounded">
        Lembar Pengesahan
      </h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <p className="text-sm text-gray-700 mb-2">
          Lembar pengesahan berisi informasi penandatangan dokumen TOR.
        </p>
        <p className="text-sm text-gray-600">
          Isi nama, jabatan, dan tanggal untuk setiap penandatangan. Data ini akan muncul di dokumen export.
        </p>
      </div>

      {/* Preview Alur Approval */}
      {workflowSteps.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Preview Alur Approval</h3>
          <div className="space-y-3">
            {workflowSteps.map((step, idx) => (
              <div key={step.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{step.label}</div>
                  <div className="text-sm text-gray-500">{step.position?.name || "-"}</div>
                </div>
                <div className="text-sm text-gray-400">Pending</div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500 italic">
            * Alur approval aktual akan disesuaikan dengan workflow bidang yang dipilih
          </p>
        </div>
      )}

      {/* Approval Signatures Form */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Penandatangan</h3>
          {isEditing && (
            <button
              type="button"
              onClick={addSignature}
              className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              <Plus size={14} />
              Tambah Penandatangan
            </button>
          )}
        </div>

        <div className="space-y-4">
          {signatures.map((signature, index) => (
            <div
              key={signature.id}
              className="border border-gray-300 rounded-lg p-4 bg-white"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-gray-900">{signature.role || `Penandatangan ${index + 1}`}</h4>
                {isEditing && signatures.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSignature(signature.id)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peran <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={signature.role}
                    onChange={(e) => updateSignature(signature.id, "role", e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  >
                    <option value="Dibuat oleh">Dibuat oleh</option>
                    <option value="Diperiksa oleh">Diperiksa oleh</option>
                    <option value="Disetujui oleh">Disetujui oleh</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={signature.date}
                    onChange={(e) => updateSignature(signature.id, "date", e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jabatan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={signature.position}
                    onChange={(e) => updateSignature(signature.id, "position", e.target.value)}
                    placeholder="Contoh: Senior Officer Enjiniring BOP"
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={signature.name}
                    onChange={(e) => updateSignature(signature.id, "name", e.target.value)}
                    placeholder="Nama lengkap"
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          ))}

          {signatures.length === 0 && (
            <div className="text-sm text-gray-500 italic py-8 text-center border border-dashed border-gray-300 rounded-lg">
              {isLoadingWorkflow
                ? "Memuat data workflow..."
                : isEditing
                ? "Klik tombol 'Tambah Penandatangan' untuk menambahkan data penandatangan"
                : "Belum ada data penandatangan"}
            </div>
          )}
        </div>
      </div>

      {/* Preview Info */}
      {!isEditing && signatures.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Preview Lembar Pengesahan</h4>
          <div className="space-y-2 text-sm text-gray-600">
            {signatures.map((sig, idx) => (
              <div key={sig.id} className="flex items-center gap-2">
                <span className="font-medium min-w-[120px]">{sig.role}:</span>
                <span>
                  {sig.name || "(Nama belum diisi)"} - {sig.position || "(Jabatan belum diisi)"}
                  {sig.date && ` - ${new Date(sig.date).toLocaleDateString("id-ID")}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
