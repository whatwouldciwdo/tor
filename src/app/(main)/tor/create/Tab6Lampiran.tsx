"use client";

import { TabProps, TechnicalParticular, InspectionTestingPlan, DocumentRequestSheet, PerformanceGuarantee, ColumnConfig } from "./types";
import { v4 as uuidv4 } from "uuid";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useConfirmModal } from "@/hooks/useModal";
import { ConfirmModal } from "@/components/Modal";

interface LampiranTemplate {
  id: number;
  name: string;
  description: string | null;
  tpgColumns?: ColumnConfig[];
  itpColumns?: ColumnConfig[];
  drsColumns?: ColumnConfig[];
  pgrsColumns?: ColumnConfig[];
  technicalParticulars: any;
  inspectionTestingPlans: any;
  documentRequestSheets: any;
  performanceGuarantees: any;
}

const tableContainer = "overflow-x-auto border rounded-lg bg-white shadow-sm";
const tableClass = "table-fixed min-w-full divide-y divide-gray-200 text-base leading-6";
const thClass =
  "px-6 py-4 text-left font-semibold text-gray-800 uppercase tracking-wide bg-gray-50 align-middle";
const tdClass = "px-6 py-4 align-middle";
const inputClass =
  "w-full px-3 py-2.5 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-base";

export default function Tab6Lampiran({ formData, onChange, isEditing }: TabProps) {

  // Generic helper to add item
  const addItem = (field: keyof typeof formData, newItem: any) => {
    const currentArray = (formData[field] as any[]) || [];
    onChange({ [field]: [...currentArray, newItem] });
  };

  // Generic helper to remove item
  const removeItem = (field: keyof typeof formData, id: string) => {
    const currentArray = (formData[field] as any[]) || [];
    onChange({ [field]: currentArray.filter((item: any) => item.id !== id) });
  };

  // Generic helper to update item
  const updateItem = (field: keyof typeof formData, id: string, key: string, value: string) => {
    const currentArray = (formData[field] as any[]) || [];
    onChange({
      [field]: currentArray.map((item: any) =>
        item.id === id ? { ...item, [key]: value } : item
      ),
    });
  };
  
  // Template state
  const [templates, setTemplates] = useState<LampiranTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const confirmModal = useConfirmModal();
  
  // Collapse state for each table section
  const [collapsedSections, setCollapsedSections] = useState({
    tpg: false,
    itp: false,
    drs: false,
    pgrs: false
  });
  
  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  
  // Fetch templates on mount
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("/api/lampiran-templates");
        if (response.ok) {
          const data = await response.json();
          setTemplates(data);
        }
      } catch (error) {
        console.error("Failed to fetch templates:", error);
      }
    };
    fetchTemplates();
  }, []);

  // Handle template selection with confirmation
  const handleTemplateSelect = (templateId: string) => {
    if (!templateId || !isEditing) return;
    
    const template = templates.find(t => t.id === parseInt(templateId));
    if (!template) return;

    // Check if there's existing data
    const hasExistingData = 
      (formData.technicalParticulars && formData.technicalParticulars.length > 0) ||
      (formData.inspectionTestingPlans && formData.inspectionTestingPlans.length > 0) ||
      (formData.documentRequestSheets && formData.documentRequestSheets.length > 0) ||
      (formData.performanceGuarantees && formData.performanceGuarantees.length > 0);

    if (hasExistingData) {
      confirmModal.showConfirm(
        `Apakah Anda yakin ingin mengganti semua data lampiran dengan template "${template.name}"? Data yang ada akan terhapus.`,
        () => applyTemplate(template),
        "warning"
      );
    } else {
      applyTemplate(template);
    }
  };

  // Apply template data to form
  const applyTemplate = (template: LampiranTemplate) => {
    console.log('📋 Applying template:', template.name);
    console.log('📋 Template TPG data sample:', template.technicalParticulars?.[0]);
    console.log('📋 Template TPG columns:', template.tpgColumns);
    
    // Generate new UUIDs for all items to avoid conflicts
    const generateItemsWithNewIds = (items: any[]) => {
      if (!Array.isArray(items)) return [];
      return items.map(item => ({ ...item, id: uuidv4() }));
    };

    const newData = {
      technicalParticulars: generateItemsWithNewIds(template.technicalParticulars || []),
      inspectionTestingPlans: generateItemsWithNewIds(template.inspectionTestingPlans || []),
      documentRequestSheets: generateItemsWithNewIds(template.documentRequestSheets || []),
      performanceGuarantees: generateItemsWithNewIds(template.performanceGuarantees || []),
    };
    
    console.log('📋 New TPG data sample:', newData.technicalParticulars?.[0]);
    
    onChange(newData);

    setSelectedTemplateId("");
  };
  
  // Helper to get default columns if template doesn't have column config
  const getDefaultTPGColumns = (): ColumnConfig[] => [
    { key: "specification", label: "Spesifikasi", width: "34%" },
    { key: "ownerRequest", label: "Owner Request", width: "33%" },
    { key: "vendorProposed", label: "Vendor Proposed & Guarantee", width: "33%" }
  ];
  
  // Get columns for TPG table (from data structure or use default)
  const getTPGColumns = (): ColumnConfig[] => {
    // If no data, use default
    if (!formData.technicalParticulars || formData.technicalParticulars.length === 0) {
      return getDefaultTPGColumns();
    }
    
    // Find first non-header item (header items only have description field)
    const firstDataItem = formData.technicalParticulars.find(item => {
      const keys = Object.keys(item).filter(k => k !== 'id');
      // A data row has more than just description
      return keys.length > 1;
    });
    
    // If no data items found (only headers), use default
    if (!firstDataItem) {
      console.log('⚠️ No data items found, using default format');
      return getDefaultTPGColumns();
    }
    
    const itemKeys = Object.keys(firstDataItem).filter(k => k !== 'id');
    
    console.log('🔍 TPG Column Detection:', {
      firstDataItem,
      itemKeys,
      hasUnit: itemKeys.includes('unit'),
      hasRequired: itemKeys.includes('required'),
      hasProposedGuaranteed: itemKeys.includes('proposedGuaranteed'),
      hasSpecified: itemKeys.includes('specified'),
      hasProposedGuarantee: itemKeys.includes('proposedGuarantee')
    });
    
    // Check for AVR format (has unit, required, proposedGuaranteed, remarks)
    if (itemKeys.includes('unit') && itemKeys.includes('required') && itemKeys.includes('proposedGuaranteed')) {
      console.log('✅ Using AVR format (6 columns)');
      return [
        { key: "description", label: "DESCRIPTION", width: "25%" },
        { key: "unit", label: "UNIT", width: "10%" },
        { key: "required", label: "REQUIRED", width: "20%" },
        { key: "proposedGuaranteed", label: "PROPOSED AND GUARANTEED", width: "25%" },
        { key: "remarks", label: "REMARKS", width: "20%" }
      ];
    }
    
    // Check for Arrester format (has description, specified, proposedGuarantee)
    if (itemKeys.includes('description') && itemKeys.includes('specified')) {
      console.log('✅ Using Arrester format (3 columns)');
      return [
        { key: "description", label: "DESCRIPTION", width: "40%" },
        { key: "specified", label: "SPECIFIED", width: "30%" },
        { key: "proposedGuarantee", label: "PROPOSED & GUARANTEE", width: "30%" }
      ];
    }
    
    // Otherwise use default format
    console.log('⚠️ Using default format (old 3 columns)');
    return getDefaultTPGColumns();
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-900 bg-blue-100 px-4 py-2 rounded">
        Lampiran
      </h2>

      {/* Template Selection Dropdown */}
      {isEditing && templates.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <label htmlFor="template-select" className="block text-sm font-medium text-gray-700 mb-2">
            Pilih Template (Opsional)
          </label>
          <select
            id="template-select"
            value={selectedTemplateId}
            onChange={(e) => handleTemplateSelect(e.target.value)}
            className="w-full md:w-96 px-3 py-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-base bg-white"
          >
            <option value="">-- Pilih Template --</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
                {template.description && ` - ${template.description}`}
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm text-gray-600">
            Template akan mengisi semua tabel di bawah dengan data default. Anda dapat mengedit data setelahnya.
          </p>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Konfirmasi Penggantian Data"
        message={confirmModal.confirmMessage}
        onConfirm={() => {
          if (confirmModal.confirmCallback) {
            confirmModal.confirmCallback();
          }
          confirmModal.close();
        }}
        onClose={confirmModal.close}
        type={confirmModal.confirmType}
      />

      {/* 1. Technical Particular & Guarantee (TPG) */}
      <div className="space-y-4">
        <div 
          className="flex justify-between items-center cursor-pointer bg-gray-50 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors" 
          onClick={() => toggleSection('tpg')}
        >
          <h3 className="text-lg font-medium text-gray-900">1. Technical Particular & Guarantee (TPG)</h3>
          {collapsedSections.tpg ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </div>

        {!collapsedSections.tpg && (
        <div className="space-y-4">

        <div className={tableContainer}>
          {(() => {
            const columns = getTPGColumns();
            const firstColumnKey = columns[0]?.key || 'specification';
            
            return (
              <table className={`${tableClass} min-w-[1250px]`}>
                <thead className="bg-gray-50">
                  <tr>
                    <th className={`${thClass} w-20`}>No.</th>
                    {columns.map((col) => (
                      <th key={col.key} className={thClass} style={{ width: col.width }}>
                        {col.label}
                      </th>
                    ))}
                    {isEditing && <th className={`${thClass} w-20`}></th>}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(() => {
                    let sectionNumber = 0;
                    
                    return (formData.technicalParticulars || []).map((item, index) => {
                      // Check if this is a header row - works for both formats
                      // Arrester format: only has description (no specified/proposedGuarantee)
                      // AVR format: only has description (no unit/required/proposedGuaranteed/remarks)
                      const isHeaderRow = item.description && 
                        !item.specified && !item.proposedGuarantee &&  // Arrester format
                        !item.unit && !item.required && !item.proposedGuaranteed && !item.remarks; // AVR format
                      
                      const firstFieldValue = item[firstColumnKey] || '';
                      const upperText = firstFieldValue.toUpperCase();
                      
                      // Check if this is a main section (case-insensitive)
                      const isMainSection = upperText.includes("SPEC") || 
                                           upperText.includes("INSPECTION") || 
                                           upperText.includes("DOCUMENTS");
                      
                      // Increment section number only for main sections
                      if (isHeaderRow && isMainSection) {
                        sectionNumber++;
                      }
                      
                      // Determine section color based on text (check most specific first)
                      let rowBgClass = "bg-white hover:bg-gray-50";
                      let textColorClass = "text-gray-900";
                      
                      if (isHeaderRow && isMainSection) {
                        // Main section headers with specific colors
                        if (upperText.includes("SPEC ARRESTER")) {
                          rowBgClass = "bg-yellow-300"; // Yellow
                          textColorClass = "text-gray-900 font-semibold";
                        } else if (upperText.includes("SPEC COUNTER LA")) {
                          rowBgClass = "bg-orange-400"; // Orange
                          textColorClass = "text-gray-900 font-semibold";
                        } else if (upperText.includes("INSPECTION") && upperText.includes("FACTORY")) {
                          rowBgClass = "bg-orange-200"; // Peach
                          textColorClass = "text-gray-900 font-semibold";
                        } else if (upperText.includes("INSPECTION") && upperText.includes("SITE")) {
                          rowBgClass = "bg-green-200"; // Light green
                          textColorClass = "text-gray-900 font-semibold";
                        } else if (upperText.includes("DOCUMENTS REQUIREMENT")) {
                          rowBgClass = "bg-blue-200"; // Light blue
                          textColorClass = "text-gray-900 font-semibold";
                        }
                      } else if (isHeaderRow && !isMainSection) {
                        // Subsection headers
                        rowBgClass = "bg-gray-100";
                        textColorClass = "text-gray-900 font-semibold";
                      }
                      
                      // For header rows, render merged cell
                      if (isHeaderRow) {
                        // Extract section number from ID (e.g., "1.2-0" -> "1.2", "1-0" -> "1")
                        const sectionId = item.id ? item.id.split('-')[0] : '';
                        
                        return (
                          <tr key={item.id} className={rowBgClass}>
                            <td className={`${tdClass} text-sm ${textColorClass} text-center`}>
                              {sectionId}
                            </td>
                            <td colSpan={columns.length} className={`${tdClass} text-sm ${textColorClass}`}>
                              {item.description}
                            </td>
                            {isEditing && <td className={`${tdClass}`}></td>}
                          </tr>
                        );
                      }
                      
                      // Regular data rows - NO column is empty
                      return (
                        <tr key={item.id} className={rowBgClass}>
                          <td className={`${tdClass} text-base ${textColorClass} font-medium text-center`}>
                            
                          </td>
                          {columns.map((col) => (
                            <td key={col.key} className={tdClass}>
                              <input
                                type="text"
                                value={item[col.key] || ''}
                                onChange={(e) => updateItem("technicalParticulars", item.id, col.key, e.target.value)}
                                disabled={!isEditing}
                                className={inputClass}
                                placeholder={col.label}
                              />
                            </td>
                          ))}
                          {isEditing && (
                            <td className={`${tdClass} text-center`}>
                              <button
                                type="button"
                                onClick={() => removeItem("technicalParticulars", item.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    });
                  })()}
                  {(formData.technicalParticulars || []).length === 0 && (
                    <tr>
                      <td colSpan={isEditing ? columns.length + 2 : columns.length + 1} className="px-6 py-8 text-center text-base text-gray-500">
                        Belum ada data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            );
          })()}
        </div>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              const columns = getTPGColumns();
              const newItem: any = { id: uuidv4() };
              columns.forEach(col => {
                newItem[col.key] = "";
              });
              addItem("technicalParticulars", newItem);
            }}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <Plus size={16} className="mr-1" /> Tambah Baris
          </button>
        )}
        </div>
        )}
      </div>

      {/* 2. Inspection Testing Plan (ITP) */}
      <div className="space-y-4">
        <div 
          className="flex justify-between items-center cursor-pointer bg-gray-50 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors" 
          onClick={() => toggleSection('itp')}
        >
          <h3 className="text-lg font-medium text-gray-900">2. Inspection Testing Plan (ITP)</h3>
          {collapsedSections.itp ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </div>

        {!collapsedSections.itp && (
        <div className="space-y-4">

        <div className={tableContainer}>
          <table className={`${tableClass} min-w-[1350px]`}>
            <thead className="bg-gray-50">
              <tr>
                <th className={`${thClass} w-20`}>No.</th>
                <th className={thClass}>Testing Items</th>
                <th className={thClass}>Testing Method</th>
                <th className={thClass}>Standard Test Reference</th>
                <th className={thClass}>Tested by</th>
                <th className={thClass}>Witness by</th>
                <th className={thClass}>Acceptance Criteria</th>
                {isEditing && <th className={`${thClass} w-20`}></th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(formData.inspectionTestingPlans || []).map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className={`${tdClass} text-base text-gray-700 font-medium`}>{index + 1}</td>
                  <td className={tdClass}><input type="text" value={item.testingItem} onChange={(e) => updateItem("inspectionTestingPlans", item.id, "testingItem", e.target.value)} disabled={!isEditing} className={inputClass} /></td>
                  <td className={tdClass}><input type="text" value={item.testingMethod} onChange={(e) => updateItem("inspectionTestingPlans", item.id, "testingMethod", e.target.value)} disabled={!isEditing} className={inputClass} /></td>
                  <td className={tdClass}><input type="text" value={item.standardTestReference} onChange={(e) => updateItem("inspectionTestingPlans", item.id, "standardTestReference", e.target.value)} disabled={!isEditing} className={inputClass} /></td>
                  <td className={tdClass}><input type="text" value={item.testedBy} onChange={(e) => updateItem("inspectionTestingPlans", item.id, "testedBy", e.target.value)} disabled={!isEditing} className={inputClass} /></td>
                  <td className={tdClass}><input type="text" value={item.witnessBy} onChange={(e) => updateItem("inspectionTestingPlans", item.id, "witnessBy", e.target.value)} disabled={!isEditing} className={inputClass} /></td>
                  <td className={tdClass}><input type="text" value={item.acceptanceCriteria} onChange={(e) => updateItem("inspectionTestingPlans", item.id, "acceptanceCriteria", e.target.value)} disabled={!isEditing} className={inputClass} /></td>
                  {isEditing && (
                    <td className={`${tdClass} text-center`}>
                      <button onClick={() => removeItem("inspectionTestingPlans", item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                    </td>
                  )}
                </tr>
              ))}
              {(formData.inspectionTestingPlans || []).length === 0 && (
                <tr><td colSpan={isEditing ? 8 : 7} className="px-6 py-8 text-center text-base text-gray-500">Belum ada data</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {isEditing && (
          <button
            type="button"
            onClick={() => addItem("inspectionTestingPlans", { id: uuidv4(), testingItem: "", testingMethod: "", standardTestReference: "", testedBy: "", witnessBy: "", acceptanceCriteria: "" })}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <Plus size={16} className="mr-1" /> Tambah Baris
          </button>
        )}
        </div>
        )}
      </div>

      {/* 3. Document Request Sheet (DRS) */}
      <div className="space-y-4">
        <div 
          className="flex justify-between items-center cursor-pointer bg-gray-50 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors" 
          onClick={() => toggleSection('drs')}
        >
          <h3 className="text-lg font-medium text-gray-900">3. Document Request Sheet (DRS)</h3>
          {collapsedSections.drs ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </div>

        {!collapsedSections.drs && (
        <div className="space-y-4">

        <div className={tableContainer}>
          <table className={`${tableClass} min-w-[950px]`}>
            <thead className="bg-gray-50">
              <tr>
                <th className={`${thClass} w-20`}>No.</th>
                <th className={thClass}>Document Requirement</th>
                <th className={thClass}>Document Types</th>
                {isEditing && <th className={`${thClass} w-20`}></th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(formData.documentRequestSheets || []).map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className={`${tdClass} text-base text-gray-700 font-medium`}>{index + 1}</td>
                  <td className={tdClass}><input type="text" value={item.documentRequirement} onChange={(e) => updateItem("documentRequestSheets", item.id, "documentRequirement", e.target.value)} disabled={!isEditing} className={inputClass} /></td>
                  <td className={tdClass}><input type="text" value={item.documentType} onChange={(e) => updateItem("documentRequestSheets", item.id, "documentType", e.target.value)} disabled={!isEditing} className={inputClass} /></td>
                  {isEditing && (
                    <td className={`${tdClass} text-center`}>
                      <button onClick={() => removeItem("documentRequestSheets", item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                    </td>
                  )}
                </tr>
              ))}
              {(formData.documentRequestSheets || []).length === 0 && (
                <tr><td colSpan={isEditing ? 4 : 3} className="px-6 py-8 text-center text-base text-gray-500">Belum ada data</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {isEditing && (
          <button
            type="button"
            onClick={() => addItem("documentRequestSheets", { id: uuidv4(), documentRequirement: "", documentType: "" })}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <Plus size={16} className="mr-1" /> Tambah Baris
          </button>
        )}
        </div>
        )}
      </div>

      {/* 4. Performance Guarantee Requirement Sheet (PGRS) */}
      <div className="space-y-4">
        <div 
          className="flex justify-between items-center cursor-pointer bg-gray-50 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors" 
          onClick={() => toggleSection('pgrs')}
        >
          <h3 className="text-lg font-medium text-gray-900">4. Performance Guarantee Requirement Sheet (PGRS)</h3>
          {collapsedSections.pgrs ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </div>

        {!collapsedSections.pgrs && (
        <div className="space-y-4">

        <div className={tableContainer}>
          <table className={`${tableClass} min-w-[1350px]`}>
            <thead className="bg-gray-50">
              <tr>
                <th className={`${thClass} w-20`}>No.</th>
                <th className={thClass}>Plant Item</th>
                <th className={thClass}>Performance Guarantee Parameter (s)</th>
                <th className={thClass}>Baseline Parameter (s)</th>
                <th className={thClass}>Verification Method</th>
                <th className={thClass}>Remedial Measure Allowed</th>
                {isEditing && <th className={`${thClass} w-20`}></th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(formData.performanceGuarantees || []).map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className={`${tdClass} text-base text-gray-700 font-medium`}>{index + 1}</td>
                  <td className={tdClass}><input type="text" value={item.plantItem} onChange={(e) => updateItem("performanceGuarantees", item.id, "plantItem", e.target.value)} disabled={!isEditing} className={inputClass} /></td>
                  <td className={tdClass}><input type="text" value={item.performanceParameter} onChange={(e) => updateItem("performanceGuarantees", item.id, "performanceParameter", e.target.value)} disabled={!isEditing} className={inputClass} /></td>
                  <td className={tdClass}><input type="text" value={item.baselineParameter} onChange={(e) => updateItem("performanceGuarantees", item.id, "baselineParameter", e.target.value)} disabled={!isEditing} className={inputClass} /></td>
                  <td className={tdClass}><input type="text" value={item.verificationMethod} onChange={(e) => updateItem("performanceGuarantees", item.id, "verificationMethod", e.target.value)} disabled={!isEditing} className={inputClass} /></td>
                  <td className={tdClass}><input type="text" value={item.remedialMeasure} onChange={(e) => updateItem("performanceGuarantees", item.id, "remedialMeasure", e.target.value)} disabled={!isEditing} className={inputClass} /></td>
                  {isEditing && (
                    <td className={`${tdClass} text-center`}>
                      <button onClick={() => removeItem("performanceGuarantees", item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                    </td>
                  )}
                </tr>
              ))}
              {(formData.performanceGuarantees || []).length === 0 && (
                <tr><td colSpan={isEditing ? 7 : 6} className="px-6 py-8 text-center text-base text-gray-500">Belum ada data</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {isEditing && (
          <button
            type="button"
            onClick={() => addItem("performanceGuarantees", { id: uuidv4(), plantItem: "", performanceParameter: "", baselineParameter: "", verificationMethod: "", remedialMeasure: "" })}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <Plus size={16} className="mr-1" /> Tambah Baris
          </button>
        )}
        </div>
        )}
      </div>
    </div>
  );
}
