// Battery Template Data - Complex Format
// Exact structure from TPG BATTERY.pdf with vendor comparison columns

const batteryTemplateDataComplex = {
  name: "Battery",
  renderMode: "table", // Use custom table rendering for complex structure
  technicalParticulars: [
    // Header row for GENERAL section
    {
      id: "1",
      rowType: "section-header",
      colSpan: { 1: 6 }, // GENERAL spans columns 2-7
      cells: [
        { value: "1", type: "number" },
        { value: "GENERAL", type: "section-header", colSpan: 6 }
      ]
    },
    {
      id: "2",
      rowType: "data",
      cells: [
        { value: "2", type: "number" },
        { value: "Keluaran Temperature", type: "label" },
        { value: "Temperature (°C): 33", type: "spec", colSpan: 2 },
        { value: "Min: 28", type: "spec-detail" },
        { value: "Max: 35", type: "spec-detail" },
        { value: "OA", type: "vendor-data" },
        { value: "Not OK", type: "vendor-data" },
        { value: "NO DATA", type: "vendor-data" },
        { value: "", type: "remarks" }
      ]
    },
    {
      id: "3",
      rowType: "data",
      cells: [
        { value: "3", type: "number" },
        { value: "Keluaran Zona Ginjal", type: "label" },
        { value: "Zona: 3", type: "spec", colSpan: 5 },
        { value: "", type: "vendor-data" },
        { value: "", type: "vendor-data" },
        { value: "", type: "vendor-data" },
        { value: "", type: "remarks" }
      ]
    },
    // APPROVAL STANDARDS section
    {
      id: "4",
      rowType: "section-header",
      cells: [
        { value: "4", type: "number" },
        { value: "APPROVAL STANDARDS", type: "section-header", colSpan: 6 }
      ]
    },
    {
      id: "6",
      rowType: "data",
      cells: [
        { value: "6", type: "number" },
        { value: "Standard", type: "label" },
        { value: "ANSI / IEEE / IEC / AS / DIN/VDE", type: "spec", colSpan: 5 },
        { value: "", type: "vendor-data" },
        { value: "", type: "vendor-data" },
        { value: "", type: "vendor-data" },
        { value: "", type: "remarks" }
      ]
    },
    // STATIONARY BATTERY SPECIFICATION section
    {
      id: "8",
      rowType: "section-header",
      cells: [
        { value: "8", type: "number" },
        { value: "STATIONARY BATTERY SPECIFICATION", type: "section-header", colSpan: 6 }
      ]
    },
    {
      id: "9",
      rowType: "data",
      cells: [
        { value: "9", type: "number" },
        { value: "Tipe Sel", type: "label" },
        { value: "OPzS", type: "spec", colSpan: 5 },
        { value: "", type: "vendor-data" },
        { value: "", type: "vendor-data" },
        { value: "", type: "vendor-data" },
        { value: "", type: "remarks" }
      ]
    },
    // Add more rows following the PDF structure...
  ],
  inspectionTestingPlans: [],
  documentRequestSheets: [],
  performanceGuarantees: []
};

module.exports = batteryTemplateDataComplex;
