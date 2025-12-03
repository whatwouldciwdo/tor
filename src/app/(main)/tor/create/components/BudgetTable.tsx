"use client";

import { useState } from "react";
import { TorFormData, BudgetItem } from "../types";

interface BudgetTableProps {
  formData: TorFormData;
  onChange: (data: Partial<TorFormData>) => void;
  isEditing?: boolean;
}

export default function BudgetTable({ formData, onChange, isEditing = true }: BudgetTableProps) {
  const budgetItems = formData.budgetItems || [];

  const addRow = () => {
    if (!isEditing) return;
    
    const newItem: BudgetItem = {
      item: "",
      description: "",
      quantity: 1,
      unit: "Set",
      unitPrice: 0,
      totalPrice: 0,
    };
    onChange({
      budgetItems: [...budgetItems, newItem],
    });
  };

  const removeRow = (index: number) => {
    if (!isEditing) return;
    
    const updated = budgetItems.filter((_, i) => i !== index);
    onChange({ budgetItems: updated });
    recalculateTotals(updated);
  };

  const updateRow = (index: number, field: keyof BudgetItem, value: any) => {
    if (!isEditing) return;
    
    const updated = [...budgetItems];
    updated[index] = { ...updated[index], [field]: value };

    // Auto-calculate totalPrice
    if (field === "quantity" || field === "unitPrice") {
      const qty = field === "quantity" ? parseFloat(value) || 0 : updated[index].quantity;
      const price = field === "unitPrice" ? parseFloat(value) || 0 : updated[index].unitPrice;
      updated[index].totalPrice = qty * price;
    }

    onChange({ budgetItems: updated });
    recalculateTotals(updated);
  };

  const recalculateTotals = (items: BudgetItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    const ppn = subtotal * 0.11; // PPN 11%
    const grandTotal = subtotal + ppn;

    onChange({
      subtotal,
      ppn,
      grandTotal,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border border-gray-300 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">No</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Item</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Description</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Qty</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Unit</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Unit Price (IDR)</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Total Price (IDR)</th>
              {isEditing && (
                <th className="px-3 py-2 text-center font-medium text-gray-700 border-b">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {budgetItems.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-600">{index + 1}</td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={item.item}
                    onChange={(e) => updateRow(index, "item", e.target.value)}
                    placeholder="Item name"
                    disabled={!isEditing}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={item.description || ""}
                    onChange={(e) => updateRow(index, "description", e.target.value)}
                    placeholder="Description"
                    disabled={!isEditing}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateRow(index, "quantity", e.target.value)}
                    disabled={!isEditing}
                    className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={item.unit}
                    onChange={(e) => updateRow(index, "unit", e.target.value)}
                    placeholder="Unit"
                    disabled={!isEditing}
                    className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateRow(index, "unitPrice", e.target.value)}
                    disabled={!isEditing}
                    className="w-32 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </td>
                <td className="px-3 py-2 font-medium text-gray-900">
                  {formatCurrency(item.totalPrice)}
                </td>
                {isEditing && (
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => removeRow(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {budgetItems.length === 0 && (
              <tr>
                <td colSpan={isEditing ? 8 : 7} className="px-3 py-8 text-center text-gray-500">
                  {isEditing
                    ? "No budget items yet. Click 'Add Item' to start."
                    : "Belum ada data anggaran."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isEditing && (
        <button
          onClick={addRow}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          + Add Item
        </button>
      )}

      {/* Summary */}
      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Subtotal:</span>
            <span className="font-medium">{formatCurrency(formData.subtotal || 0)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">PPN 11%:</span>
            <span className="font-medium">{formatCurrency(formData.ppn || 0)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Grand Total:</span>
            <span className="text-blue-600">{formatCurrency(formData.grandTotal || 0)}</span>
          </div>
        </div>
      </div>
      
      {/* Note */}
      <div className="text-xs text-gray-600 italic">
        <span>Rencana anggaran sebesar {formatCurrency(formData.grandTotal || 0)} termasuk PPN 11%.</span>
      </div>
    </div>
  );
}