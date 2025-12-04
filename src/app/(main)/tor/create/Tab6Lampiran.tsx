"use client";

import { TabProps, TechnicalParticular, InspectionTestingPlan, DocumentRequestSheet, PerformanceGuarantee } from "./types";
import { v4 as uuidv4 } from "uuid";
import { Plus, Trash2 } from "lucide-react";

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

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-900 bg-blue-100 px-4 py-2 rounded">
        Lampiran
      </h2>

      {/* 1. Technical Particular & Guarantee (TPG) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">1. Technical Particular & Guarantee (TPG)</h3>
        </div>
        
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider w-16">No.</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Spesifikasi</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Owner Request</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Vendor Proposed & Guarantee</th>
                {isEditing && <th className="px-6 py-4 w-16"></th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(formData.technicalParticulars || []).map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-base text-gray-700 font-medium">{index + 1}</td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={item.specification}
                      onChange={(e) => updateItem("technicalParticulars", item.id, "specification", e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border rounded focus:ring-blue-500 focus:border-blue-500 text-base"
                      placeholder="Spesifikasi"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={item.ownerRequest}
                      onChange={(e) => updateItem("technicalParticulars", item.id, "ownerRequest", e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border rounded focus:ring-blue-500 focus:border-blue-500 text-base"
                      placeholder="Owner Request"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={item.vendorProposed}
                      onChange={(e) => updateItem("technicalParticulars", item.id, "vendorProposed", e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border rounded focus:ring-blue-500 focus:border-blue-500 text-base"
                      placeholder="Vendor Proposed"
                    />
                  </td>
                  {isEditing && (
                    <td className="px-6 py-4 text-center">
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
              ))}
              {(formData.technicalParticulars || []).length === 0 && (
                <tr>
                  <td colSpan={isEditing ? 5 : 4} className="px-6 py-8 text-center text-base text-gray-500">
                    Belum ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {isEditing && (
          <button
            type="button"
            onClick={() => addItem("technicalParticulars", { id: uuidv4(), specification: "", ownerRequest: "", vendorProposed: "" })}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <Plus size={16} className="mr-1" /> Tambah Baris
          </button>
        )}
      </div>

      {/* 2. Inspection Testing Plan (ITP) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">2. Inspection Testing Plan (ITP)</h3>
        </div>
        
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider w-16">No.</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Testing Items</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Testing Method</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Standard Test Reference</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Tested by</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Witness by</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Acceptance Criteria</th>
                {isEditing && <th className="px-6 py-4 w-16"></th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(formData.inspectionTestingPlans || []).map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-base text-gray-700 font-medium">{index + 1}</td>
                  <td className="px-6 py-4"><input type="text" value={item.testingItem} onChange={(e) => updateItem("inspectionTestingPlans", item.id, "testingItem", e.target.value)} disabled={!isEditing} className="w-full px-3 py-2 border rounded text-base" /></td>
                  <td className="px-6 py-4"><input type="text" value={item.testingMethod} onChange={(e) => updateItem("inspectionTestingPlans", item.id, "testingMethod", e.target.value)} disabled={!isEditing} className="w-full px-3 py-2 border rounded text-base" /></td>
                  <td className="px-6 py-4"><input type="text" value={item.standardTestReference} onChange={(e) => updateItem("inspectionTestingPlans", item.id, "standardTestReference", e.target.value)} disabled={!isEditing} className="w-full px-3 py-2 border rounded text-base" /></td>
                  <td className="px-6 py-4"><input type="text" value={item.testedBy} onChange={(e) => updateItem("inspectionTestingPlans", item.id, "testedBy", e.target.value)} disabled={!isEditing} className="w-full px-3 py-2 border rounded text-base" /></td>
                  <td className="px-6 py-4"><input type="text" value={item.witnessBy} onChange={(e) => updateItem("inspectionTestingPlans", item.id, "witnessBy", e.target.value)} disabled={!isEditing} className="w-full px-3 py-2 border rounded text-base" /></td>
                  <td className="px-6 py-4"><input type="text" value={item.acceptanceCriteria} onChange={(e) => updateItem("inspectionTestingPlans", item.id, "acceptanceCriteria", e.target.value)} disabled={!isEditing} className="w-full px-3 py-2 border rounded text-base" /></td>
                  {isEditing && (
                    <td className="px-6 py-4 text-center">
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

      {/* 3. Document Request Sheet (DRS) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">3. Document Request Sheet (DRS)</h3>
        </div>
        
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider w-16">No.</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Document Requirement</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Document Types</th>
                {isEditing && <th className="px-6 py-4 w-16"></th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(formData.documentRequestSheets || []).map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-base text-gray-700 font-medium">{index + 1}</td>
                  <td className="px-6 py-4"><input type="text" value={item.documentRequirement} onChange={(e) => updateItem("documentRequestSheets", item.id, "documentRequirement", e.target.value)} disabled={!isEditing} className="w-full px-3 py-2 border rounded text-base" /></td>
                  <td className="px-6 py-4"><input type="text" value={item.documentType} onChange={(e) => updateItem("documentRequestSheets", item.id, "documentType", e.target.value)} disabled={!isEditing} className="w-full px-3 py-2 border rounded text-base" /></td>
                  {isEditing && (
                    <td className="px-6 py-4 text-center">
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

      {/* 4. Performance Guarantee Requirement Sheet (PGRS) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">4. Performance Guarantee Requirement Sheet (PGRS)</h3>
        </div>
        
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider w-16">No.</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Plant Item</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Performance Guarantee Parameter (s)</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Baseline Parameter (s)</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Verification Method</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Remedial Measure Allowed</th>
                {isEditing && <th className="px-6 py-4 w-16"></th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(formData.performanceGuarantees || []).map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-base text-gray-700 font-medium">{index + 1}</td>
                  <td className="px-6 py-4"><input type="text" value={item.plantItem} onChange={(e) => updateItem("performanceGuarantees", item.id, "plantItem", e.target.value)} disabled={!isEditing} className="w-full px-3 py-2 border rounded text-base" /></td>
                  <td className="px-6 py-4"><input type="text" value={item.performanceParameter} onChange={(e) => updateItem("performanceGuarantees", item.id, "performanceParameter", e.target.value)} disabled={!isEditing} className="w-full px-3 py-2 border rounded text-base" /></td>
                  <td className="px-6 py-4"><input type="text" value={item.baselineParameter} onChange={(e) => updateItem("performanceGuarantees", item.id, "baselineParameter", e.target.value)} disabled={!isEditing} className="w-full px-3 py-2 border rounded text-base" /></td>
                  <td className="px-6 py-4"><input type="text" value={item.verificationMethod} onChange={(e) => updateItem("performanceGuarantees", item.id, "verificationMethod", e.target.value)} disabled={!isEditing} className="w-full px-3 py-2 border rounded text-base" /></td>
                  <td className="px-6 py-4"><input type="text" value={item.remedialMeasure} onChange={(e) => updateItem("performanceGuarantees", item.id, "remedialMeasure", e.target.value)} disabled={!isEditing} className="w-full px-3 py-2 border rounded text-base" /></td>
                  {isEditing && (
                    <td className="px-6 py-4 text-center">
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
    </div>
  );
}
