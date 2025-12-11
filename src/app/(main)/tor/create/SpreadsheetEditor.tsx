"use client";

import React, { useState, useCallback, useEffect } from "react";
import Spreadsheet, { CellBase, Matrix } from "react-spreadsheet";

interface SpreadsheetEditorProps {
  data: Matrix<CellBase>;
  onChange: (data: Matrix<CellBase>) => void;
  headers?: string[];
  rowLabels?: string[];  // Custom row labels for section numbering
  isEditing: boolean;
}

export default function SpreadsheetEditor({
  data,
  onChange,
  headers,
  rowLabels,
  isEditing,
}: SpreadsheetEditorProps) {
  const [spreadsheetData, setSpreadsheetData] = useState<Matrix<CellBase>>(data);

  // Sync with external data changes
  useEffect(() => {
    setSpreadsheetData(data);
  }, [data]);

  const handleChange = useCallback(
    (newData: Matrix<CellBase>) => {
      setSpreadsheetData(newData);
      onChange(newData);
    },
    [onChange]
  );

  // Generate column labels from headers or use default A, B, C...
  const columnLabels = headers || 
    Array.from({ length: (data[0]?.length || 6) }, (_, i) => 
      String.fromCharCode(65 + i)
    );

  return (
    <div className="spreadsheet-container overflow-auto border rounded-lg bg-white">
      <style jsx global>{`
        .Spreadsheet {
          --background-color: #ffffff;
          --border-color: #e5e7eb;
          --readonly-color: #f9fafb;
        }
        
        .Spreadsheet__table {
          border-collapse: collapse;
          width: 100%;
          font-size: 14px;
        }
        
        .Spreadsheet__header {
          background-color: #f3f4f6;
          font-weight: 600;
          text-align: center;
          padding: 8px 12px;
          border: 1px solid #e5e7eb;
          color: #374151;
        }
        
        .Spreadsheet__cell {
          border: 1px solid #e5e7eb;
          min-width: 100px;
          height: 36px;
          padding: 0;
        }
        
        .Spreadsheet__cell--readonly {
          background-color: #f9fafb;
        }
        
        .Spreadsheet__data-viewer {
          padding: 8px 12px;
          white-space: pre-wrap;
          word-break: break-word;
        }
        
        .Spreadsheet__data-editor input {
          width: 100%;
          height: 100%;
          padding: 8px 12px;
          border: none;
          outline: 2px solid #3b82f6;
          font-size: 14px;
        }
        
        .Spreadsheet__active-cell {
          outline: 2px solid #3b82f6 !important;
        }
        
        .Spreadsheet__floating-rect--selected {
          background-color: rgba(59, 130, 246, 0.1);
        }
      `}</style>
      
      <Spreadsheet
        data={spreadsheetData}
        onChange={isEditing ? handleChange : undefined}
        columnLabels={columnLabels}
        rowLabels={rowLabels}
      />
    </div>
  );
}

// Helper function to convert JSON data to spreadsheet matrix
export function jsonToSpreadsheet(jsonData: any[], headers: string[]): Matrix<CellBase> {
  const matrix: Matrix<CellBase> = [];
  
  // Add header row
  matrix.push(headers.map(h => ({ value: h, readOnly: true })));
  
  // Add data rows
  jsonData.forEach((row) => {
    const rowData: CellBase[] = headers.map((header) => ({
      value: row[header.toLowerCase()] || row[header] || "",
    }));
    matrix.push(rowData);
  });
  
  return matrix;
}

// Helper function to convert spreadsheet matrix back to JSON
export function spreadsheetToJson(matrix: Matrix<CellBase>, headers: string[]): any[] {
  const result: any[] = [];
  
  // Skip first row (headers) and convert each row to object
  for (let i = 1; i < matrix.length; i++) {
    const row = matrix[i];
    const obj: any = { id: `row-${i}` };
    
    headers.forEach((header, j) => {
      obj[header.toLowerCase()] = row[j]?.value || "";
    });
    
    result.push(obj);
  }
  
  return result;
}
