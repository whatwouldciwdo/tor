"use client";

import { TabProps } from "./types";

export default function Tab6Lampiran({ formData, onChange }: TabProps) {
  const handleInputChange = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 bg-blue-100 px-4 py-2 rounded">
        Lampiran
      </h2>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> Untuk MVP, lampiran disimpan dalam format JSON. Fitur form builder untuk lampiran akan ditambahkan di fase berikutnya.
        </p>
      </div>

      {/* Technical Particular & Guarantee (TPG) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Technical Particular & Guarantee (TPG)
        </label>
        <textarea
          value={
            formData.tpgData
              ? JSON.stringify(formData.tpgData, null, 2)
              : ""
          }
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              handleInputChange("tpgData", parsed);
            } catch {
              // Invalid JSON, ignore
            }
          }}
          placeholder='{"specifications": [], "guarantees": []}'
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">
          Format JSON untuk spesifikasi teknis dan garansi
        </p>
      </div>

      {/* Inspection Testing Plan (ITP) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Inspection Testing Plan (ITP)
        </label>
        <textarea
          value={
            formData.itpData
              ? JSON.stringify(formData.itpData, null, 2)
              : ""
          }
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              handleInputChange("itpData", parsed);
            } catch {
              // Invalid JSON, ignore
            }
          }}
          placeholder='{"testingItems": [], "methods": []}'
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">
          Format JSON untuk rencana inspeksi dan testing
        </p>
      </div>

      {/* Document Request Sheet (DRS) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Document Request Sheet (DRS)
        </label>
        <textarea
          value={
            formData.drsData
              ? JSON.stringify(formData.drsData, null, 2)
              : ""
          }
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              handleInputChange("drsData", parsed);
            } catch {
              // Invalid JSON, ignore
            }
          }}
          placeholder='{"documents": []}'
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">
          Format JSON untuk daftar dokumen yang diperlukan
        </p>
      </div>

      {/* Performance Guarantee Requirement Sheet (PGRS) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Performance Guarantee Requirement Sheet (PGRS)
        </label>
        <textarea
          value={
            formData.pgrsData
              ? JSON.stringify(formData.pgrsData, null, 2)
              : ""
          }
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              handleInputChange("pgrsData", parsed);
            } catch {
              // Invalid JSON, ignore
            }
          }}
          placeholder='{"guarantees": [], "duration": ""}'
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">
          Format JSON untuk persyaratan garansi performa
        </p>
      </div>
    </div>
  );
}
