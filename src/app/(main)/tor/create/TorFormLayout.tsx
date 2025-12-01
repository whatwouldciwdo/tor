"use client";

import { saveAs } from "file-saver";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TorFormData, TabId, Tor } from "./types";
import Tab1InformasiUmum from "./Tab1InformasiUmum";
import Tab2Pendahuluan from "./Tab2Pendahuluan";
import Tab3TahapanPekerjaan from "./Tab3TahapanPekerjaan";
import Tab4Usulan from "./Tab4Usulan";
import Tab5LembarPengesahan from "./Tab5LembarPengesahan";
import Tab6Lampiran from "./Tab6Lampiran";
import { Edit, X } from "lucide-react";

interface TorFormLayoutProps {
  torId?: number;
  initialData?: Tor;
  bidangId?: number;
  bidangName?: string;
  creatorName?: string;
}

export default function TorFormLayout({
  torId,
  initialData,
  bidangId,
  bidangName,
  creatorName,
}: TorFormLayoutProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("informasi-umum");
  const [formData, setFormData] = useState<TorFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    bidangId: bidangId || initialData?.bidangId,
    creationDate: initialData?.creationDate || "",
    creationYear: initialData?.creationYear || new Date().getFullYear(),
    budgetType: initialData?.budgetType || "",
    workType: initialData?.workType || "",
    program: initialData?.program || "",
    rkaYear: initialData?.rkaYear,
    projectStartDate: initialData?.projectStartDate || "",
    projectEndDate: initialData?.projectEndDate || "",
    executionYear: initialData?.executionYear,
    materialJasaValue: initialData?.materialJasaValue,
    budgetCurrency: initialData?.budgetCurrency || "IDR",
    budgetAmount: initialData?.budgetAmount,
    coverImage: initialData?.coverImage || null,
    introduction: initialData?.introduction || "",
    background: initialData?.background || "",
    objective: initialData?.objective || "",
    scope: initialData?.scope || "",
    duration: initialData?.duration,
    durationUnit: initialData?.durationUnit || "days",
    technicalSpec: initialData?.technicalSpec || "",
    generalProvisions: initialData?.generalProvisions || "",
    deliveryPoint: initialData?.deliveryPoint || "",
    deliveryMechanism: initialData?.deliveryMechanism || "",
    budgetItems: initialData?.budgetItems || [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Per-tab editing state - Tab1 always editable, Tab2-6 start in view mode
  const [tabEditingState, setTabEditingState] = useState<Record<TabId, boolean>>({
    "informasi-umum": true, // Always editable
    "pendahuluan": false,
    "tahapan-pekerjaan": false,
    "usulan": false,
    "lembar-pengesahan": false,
    "lampiran": false,
  });

  // Set initial dates on client-side only to avoid hydration mismatch
  useEffect(() => {
    if (!initialData && !formData.creationDate) {
      const today = new Date().toISOString().split("T")[0];
      const year = new Date().getFullYear();
      setFormData((prev) => ({
        ...prev,
        creationDate: today,
        creationYear: year,
      }));
    }
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!torId) return; // Only auto-save for existing ToR

    const interval = setInterval(() => {
      handleSave(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [formData, torId]);

  const handleChange = (data: Partial<TorFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSave = async (isAutoSave = false) => {
    if (!isAutoSave) setIsSaving(true);

    try {
      const url = torId ? `/api/tor/${torId}` : "/api/tor";
      const method = torId ? "PUT" : "POST";

      console.log("💾 Saving TOR...");
      console.log("   - URL:", url);
      console.log("   - Method:", method);
      console.log("   - Title:", formData.title);
      console.log("   - Introduction (preview):", formData.introduction?.substring(0, 50));
      console.log("   - coverImage:", formData.coverImage);

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save");
      }

      const savedTor = await response.json();
      
      console.log("✅ TOR saved successfully!");
      console.log("   - ID:", savedTor.id);
      console.log("   - coverImage in response:", savedTor.coverImage);
      
      setLastSaved(new Date());

      if (!torId) {
        // Redirect to edit page after first save
        router.push(`/tor/create?id=${savedTor.id}`);
      }

      if (!isAutoSave) {
        alert("ToR saved successfully!");
        // After saving, switch activeTab back to view mode (except Tab1)
        if (activeTab !== "informasi-umum") {
          setTabEditingState(prev => ({ ...prev, [activeTab]: false }));
        }
      }
    } catch (error: any) {
      console.error("❌ Save error:", error);
      if (!isAutoSave) {
        alert(error.message || "Failed to save ToR");
      }
    } finally {
      if (!isAutoSave) setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.title || !formData.background || !formData.objective) {
      alert("Please fill in required fields: Title, Background, and Objective");
      return;
    }

    if (!confirm("Submit this ToR for approval? You won't be able to edit it after submission.")) {
      return;
    }

    setSubmitting(true);

    try {
      // Save first
      await handleSave();

      // Then submit
      const response = await fetch(`/api/tor/${torId}/submit`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit");
      }

      alert("ToR submitted successfully!");
      router.push("/tor");
    } catch (error: any) {
      console.error("Submit error:", error);
      alert(error.message || "Failed to submit ToR");
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { id: "informasi-umum" as TabId, label: "Informasi Umum", component: Tab1InformasiUmum },
    { id: "pendahuluan" as TabId, label: "Pendahuluan", component: Tab2Pendahuluan },
    { id: "tahapan-pekerjaan" as TabId, label: "Tahapan Pekerjaan", component: Tab3TahapanPekerjaan },
    { id: "usulan" as TabId, label: "Usulan", component: Tab4Usulan },
    { id: "lembar-pengesahan" as TabId, label: "Lembar Pengesahan", component: Tab5LembarPengesahan },
    { id: "lampiran" as TabId, label: "Lampiran", component: Tab6Lampiran },
  ];

  const ActiveTabComponent = tabs.find((t) => t.id === activeTab)?.component;

  const formatCurrency = (amount?: number, currency?: string) => {
    if (!amount) return `${currency || "IDR"} 0`;
    
    const currencySymbol = currency || "IDR";
    return `${currencySymbol} ${amount.toLocaleString("id-ID")}`;
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID");
  };

  const handleExport = async () => {
    if (!torId) return;
    
    // Auto-save before export to ensure latest data
    await handleSave(true);
    
    try {
      const response = await fetch(`/api/tor/${torId}/export`);
      if (!response.ok) {
        throw new Error('Failed to export ToR');
      }
      const blob = await response.blob();
      // Determine filename from Content-Disposition header if present
      let filename = `TOR-${formData.number || "draft"}.docx`;
      const disposition = response.headers.get('Content-Disposition');
      if (disposition) {
        const match = disposition.match(/filename\s*=\s*"?([^";]+)"?/i);
        if (match && match[1]) {
          filename = match[1];
        }
      }
      saveAs(blob, filename);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export ToR');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            {torId ? "Edit TOR" : "Create New TOR"}
          </h1>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Nomor TOR</div>
              <div className="text-2xl font-bold text-blue-600">
                {formData.number || "TOR-XXXX-XXX"}
              </div>
              <div className="text-lg text-gray-700">{formData.program || formData.title || "Untitled"}</div>
              <div className="text-sm text-gray-500">
                Bidang: {bidangName || "-"} | Creator: {creatorName || "-"}
              </div>
            </div>

            <div className="text-right space-y-2">
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                STATUS: {formData.statusStage || "DRAFT"}
              </div>
              <div className="text-sm text-gray-600">
                Tgl Pembuatan: {formatDate(formData.creationDate)}
              </div>
              <div className="text-sm text-gray-600">
                Nilai Anggaran: {formatCurrency(formData.budgetAmount || undefined, formData.budgetCurrency || undefined)}
              </div>
              <button
                type="button"
                onClick={handleExport}
                disabled={!torId}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export Word
              </button>
            </div>
          </div>

          {lastSaved && (
            <div className="mt-4 text-xs text-gray-500">
              Last saved: {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                activeTab === tab.id
                  ? "bg-gray-900 text-white"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm min-h-[500px]">
          {/* Edit button for Tab2-6 inside tab content */}
          {activeTab !== "informasi-umum" && (
            <div className="flex justify-end p-4 pb-0">
              <button
                onClick={() => {
                  const isCurrentlyEditing = tabEditingState[activeTab];
                  if (isCurrentlyEditing) {
                    if (confirm("Batalkan perubahan? Data yang belum disimpan akan hilang.")) {
                      setTabEditingState(prev => ({ ...prev, [activeTab]: false }));
                    }
                  } else {
                    setTabEditingState(prev => ({ ...prev, [activeTab]: true }));
                  }
                }}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition text-sm ${
                  tabEditingState[activeTab]
                    ? "bg-red-100 text-red-700 hover:bg-red-200 border border-red-300"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {tabEditingState[activeTab] ? (
                  <>
                    <X size={16} />
                    Cancel Edit
                  </>
                ) : (
                  <>
                    <Edit size={16} />
                    Edit
                  </>
                )}
              </button>
            </div>
          )}
          
          <div className="p-6">
            {ActiveTabComponent && (
              <ActiveTabComponent formData={formData} onChange={handleChange} isEditing={tabEditingState[activeTab]} />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.push("/tor")}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <div className="flex gap-3">
            {tabEditingState[activeTab] && activeTab !== "informasi-umum" && (
              <button
                onClick={() => handleSave(false)}
                disabled={isSaving}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Draft"}
              </button>
            )}
            {activeTab === "informasi-umum" && (
              <button
                onClick={() => handleSave(false)}
                disabled={isSaving}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Draft"}
              </button>
            )}

            {torId && formData.statusStage === "DRAFT" && (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit for Approval"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}