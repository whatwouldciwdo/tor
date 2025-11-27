"use client";

import { TabProps } from "./types";

export default function Tab5LembarPengesahan({ formData }: TabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 bg-blue-100 px-4 py-2 rounded">
        Lembar Pengesahan
      </h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <p className="text-sm text-gray-700 mb-4">
          Lembar pengesahan akan otomatis dibuat berdasarkan workflow approval yang telah dikonfigurasi untuk bidang ini.
        </p>
        <p className="text-sm text-gray-600">
          Setelah ToR disubmit, approval chain akan ditampilkan di sini dengan status masing-masing approver.
        </p>
      </div>

      {/* Placeholder for approval chain preview */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Preview Alur Approval</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
              1
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">Approval Level 1</div>
              <div className="text-sm text-gray-500">Assistant Manager Bidang</div>
            </div>
            <div className="text-sm text-gray-400">Pending</div>
          </div>

          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-semibold">
              2
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">Approval Level 2</div>
              <div className="text-sm text-gray-500">Assistant Manager LIM</div>
            </div>
            <div className="text-sm text-gray-400">Pending</div>
          </div>

          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-semibold">
              3
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">Approval Level 3</div>
              <div className="text-sm text-gray-500">Manager Engineering</div>
            </div>
            <div className="text-sm text-gray-400">Pending</div>
          </div>

          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-semibold">
              4
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">Approval Level 4</div>
              <div className="text-sm text-gray-500">Pengadaan</div>
            </div>
            <div className="text-sm text-gray-400">Pending</div>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-500 italic">
          * Alur approval aktual akan disesuaikan dengan workflow bidang yang dipilih
        </p>
      </div>
    </div>
  );
}
