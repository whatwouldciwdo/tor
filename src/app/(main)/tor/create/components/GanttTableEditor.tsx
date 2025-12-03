"use client";

import { WorkStagesTable, WorkStageYear, WorkStageRow } from "../types";
import { Trash2, Plus } from "lucide-react";
import { useState } from "react";

interface GanttTableEditorProps {
  data: WorkStagesTable | undefined;
  onChange: (data: WorkStagesTable) => void;
  isEditing?: boolean;
}

// Initialize default table with 2 years
function createDefaultTable(): WorkStagesTable {
  const currentYear = new Date().getFullYear();
  const year1: WorkStageYear = {
    id: `year-${currentYear}`,
    label: currentYear.toString(),
    months: ["apr", "mei", "jun", "Jul", "Aug", "Sep", "Oct", "Nop", "des", "jan", "peb", "mar"],
  };
  const year2: WorkStageYear = {
    id: `year-${currentYear + 1}`,
    label: (currentYear + 1).toString(),
    months: ["apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec", "jan", "feb", "mar"],
  };

  return {
    years: [year1, year2],
    rows: [],
  };
}

export default function GanttTableEditor({ data, onChange, isEditing = false }: GanttTableEditorProps) {
  const table = data || createDefaultTable();

  const handleAddRow = () => {
    const newRow: WorkStageRow = {
      id: `row-${Date.now()}`,
      no: table.rows.length + 1,
      description: "",
      schedule: {},
    };
    onChange({ ...table, rows: [...table.rows, newRow] });
  };

  const handleDeleteRow = (rowId: string) => {
    const updatedRows = table.rows
      .filter((r) => r.id !== rowId)
      .map((r, idx) => ({ ...r, no: idx + 1 }));
    onChange({ ...table, rows: updatedRows });
  };

  const handleDescriptionChange = (rowId: string, description: string) => {
    const updatedRows = table.rows.map((r) =>
      r.id === rowId ? { ...r, description } : r
    );
    onChange({ ...table, rows: updatedRows });
  };

  const handleCellToggle = (rowId: string, yearId: string, monthIndex: number) => {
    if (!isEditing) return;

    const updatedRows = table.rows.map((r) => {
      if (r.id === rowId) {
        const yearSchedule = r.schedule[yearId] || {};
        const newYearSchedule = {
          ...yearSchedule,
          [monthIndex]: !yearSchedule[monthIndex],
        };
        return {
          ...r,
          schedule: { ...r.schedule, [yearId]: newYearSchedule },
        };
      }
      return r;
    });
    onChange({ ...table, rows: updatedRows });
  };

  const handleYearLabelChange = (yearId: string, label: string) => {
    const updatedYears = table.years.map((y) =>
      y.id === yearId ? { ...y, label } : y
    );
    onChange({ ...table, years: updatedYears });
  };

  const handleMonthChange = (yearId: string, monthIndex: number, value: string) => {
    const updatedYears = table.years.map((y) => {
      if (y.id === yearId) {
        const newMonths = [...y.months];
        newMonths[monthIndex] = value;
        return { ...y, months: newMonths };
      }
      return y;
    });
    onChange({ ...table, years: updatedYears });
  };

  const handleAddMonth = (yearId: string) => {
    const updatedYears = table.years.map((y) => {
      if (y.id === yearId) {
        return { ...y, months: [...y.months, "New"] };
      }
      return y;
    });
    onChange({ ...table, years: updatedYears });
  };

  const handleDeleteMonth = (yearId: string, monthIndex: number) => {
    const updatedYears = table.years.map((y) => {
      if (y.id === yearId) {
        const newMonths = y.months.filter((_, idx) => idx !== monthIndex);
        return { ...y, months: newMonths };
      }
      return y;
    });
    
    // Also update rows to remove schedule data for the deleted month
    const updatedRows = table.rows.map((r) => {
      const yearSchedule = r.schedule[yearId];
      if (!yearSchedule) return r;

      const newYearSchedule: Record<number, boolean> = {};
      Object.entries(yearSchedule).forEach(([key, val]) => {
        const idx = parseInt(key);
        if (idx < monthIndex) {
          newYearSchedule[idx] = val;
        } else if (idx > monthIndex) {
          // Shift indices down
          newYearSchedule[idx - 1] = val;
        }
      });

      return {
        ...r,
        schedule: { ...r.schedule, [yearId]: newYearSchedule },
      };
    });

    onChange({ years: updatedYears, rows: updatedRows });
  };

  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="overflow-x-auto border border-gray-300 rounded-lg">
        <table className="min-w-full border-collapse">
          {/* Header Row 1: Year Labels */}
          <thead>
            <tr className="bg-cyan-400">
              <th
                rowSpan={2}
                className="border border-gray-400 px-2 py-2 text-center font-bold text-sm w-12 !text-black"
                style={{ color: 'black' }}
              >
                No
              </th>
              <th
                rowSpan={2}
                className="border border-gray-400 px-4 py-2 text-center font-bold text-sm min-w-[200px] !text-black"
                style={{ color: 'black' }}
              >
                Deskripsi
              </th>
              {table.years.map((year) => (
                <th
                  key={year.id}
                  colSpan={year.months.length}
                  className="border border-gray-400 px-2 py-2 text-center font-bold text-sm !text-black relative group"
                  style={{ color: 'black' }}
                >
                  <div className="flex items-center justify-center gap-2">
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={year.label}
                          onChange={(e) => handleYearLabelChange(year.id, e.target.value)}
                          className="w-24 text-center bg-transparent border-b border-gray-600 focus:outline-none focus:border-gray-800 !text-black placeholder-gray-600"
                          style={{ color: 'black' }}
                        />
                        <button
                          onClick={() => handleAddMonth(year.id)}
                          className="p-1 hover:bg-cyan-500 rounded !text-black"
                          style={{ color: 'black' }}
                          title="Tambah Bulan"
                        >
                          <Plus size={14} />
                        </button>
                      </>
                    ) : (
                      year.label
                    )}
                  </div>
                </th>
              ))}
            </tr>

            {/* Header Row 2: Month Labels */}
            <tr className="bg-cyan-400">
              {table.years.map((year) =>
                year.months.map((month, idx) => (
                  <th
                    key={`${year.id}-month-${idx}`}
                    className="border border-gray-400 px-1 py-1 text-center text-xs font-semibold w-16 !text-black relative group"
                    style={{ color: 'black' }}
                  >
                    {isEditing ? (
                      <div className="flex flex-col items-center">
                        <input
                          type="text"
                          value={month}
                          onChange={(e) => handleMonthChange(year.id, idx, e.target.value)}
                          className="w-full text-center bg-transparent text-xs focus:outline-none focus:bg-white focus:bg-opacity-20 !text-black"
                          style={{ color: 'black' }}
                        />
                        <button
                          onClick={() => handleDeleteMonth(year.id, idx)}
                          className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-0.5 w-4 h-4 flex items-center justify-center"
                          title="Hapus Bulan"
                        >
                          <span className="text-[10px] leading-none">×</span>
                        </button>
                      </div>
                    ) : (
                      month
                    )}
                  </th>
                ))
              )}
            </tr>
          </thead>

          {/* Body: Data Rows */}
          <tbody>
            {table.rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {/* Row Number */}
                <td className="border border-gray-400 px-2 py-2 text-center text-sm !text-black" style={{ color: 'black' }}>
                  {row.no}
                </td>

                {/* Description */}
                <td className="border border-gray-400 px-2 py-2 text-sm !text-black" style={{ color: 'black' }}>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.description}
                        onChange={(e) => handleDescriptionChange(row.id, e.target.value)}
                        placeholder="Deskripsi tahapan..."
                        className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm !text-black"
                        style={{ color: 'black' }}
                      />
                    ) : (
                      <span className="flex-1 !text-black" style={{ color: 'black' }}>{row.description}</span>
                    )}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(row.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Hapus baris"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>

                {/* Schedule Cells */}
                {table.years.map((year) =>
                  year.months.map((_, monthIdx) => {
                    const isActive = row.schedule[year.id]?.[monthIdx] || false;
                    return (
                      <td
                        key={`${row.id}-${year.id}-${monthIdx}`}
                        onClick={() => handleCellToggle(row.id, year.id, monthIdx)}
                        className={`border border-gray-400 p-0 w-16 h-10 cursor-pointer transition-colors ${
                          isActive ? "bg-green-500 hover:bg-green-600" : "bg-white hover:bg-gray-100"
                        } ${!isEditing ? "cursor-default" : ""}`}
                        title={isEditing ? "Klik untuk toggle" : ""}
                      />
                    );
                  })
                )}
              </tr>
            ))}

            {/* Empty State */}
            {table.rows.length === 0 && (
              <tr>
                <td
                  colSpan={2 + table.years.reduce((acc, y) => acc + y.months.length, 0)}
                  className="border border-gray-400 px-4 py-8 text-center text-gray-500 text-sm"
                >
                  {isEditing ? "Klik tombol 'Tambah Baris' untuk menambahkan tahapan pekerjaan" : "Tidak ada data tahapan pekerjaan"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Row Button */}
      {isEditing && (
        <button
          type="button"
          onClick={handleAddRow}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={18} />
          Tambah Baris
        </button>
      )}

      {/* Instructions */}
      {isEditing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          <p className="font-semibold mb-1">Cara Menggunakan:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Klik label tahun atau bulan untuk mengedit</li>
            <li>Gunakan tombol (+) di sebelah tahun untuk menambah bulan</li>
            <li>Hover pada bulan dan klik (x) untuk menghapus bulan</li>
            <li>Klik kotak putih untuk menandai jadwal (akan berubah hijau)</li>
            <li>Klik kotak hijau untuk menghapus jadwal (akan berubah putih)</li>
            <li>Gunakan tombol "Tambah Baris" untuk menambah tahapan</li>
            <li>Gunakan ikon 🗑️ untuk menghapus baris</li>
          </ul>
        </div>
      )}
    </div>
  );
}
