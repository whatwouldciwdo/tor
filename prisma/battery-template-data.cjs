// Battery Template Data
// Based on TPG BATTERY.pdf
// Header structure: NO | SPESIFICATION REQUIREMENTS (with sub-columns) | NAMA VENDOR (PT. X, PT. Y, PT. Z) | KETERANGAN
// SPESIFICATION REQUIREMENTS has internal sub-columns: [name, value1, value2, value3]
// PT.X, PT.Y, PT.Z columns are for VENDOR input (empty by default)

const batteryTemplateData = {
  name: "Battery",
  renderMode: "table", // Table mode works correctly with spec1-spec4 structure
  technicalParticulars: {
    headers: ["No.", "SPESIFICATION REQUIREMENTS", "PT. X", "PT. Y", "PT. Z", "KETERANGAN"],
    // specColumns defines the sub-columns inside SPESIFICATION REQUIREMENTS
    specColumns: 4, // Up to 4 sub-columns inside spec requirements
    sections: [
      {
        id: "general",
        title: "GENERAL",
        number: "1",
        items: [
          {
            id: "2",
            spec1: "Kesuaian Temperature",
            spec2: "Temperatur (°C): 33",
            spec3: "Min: 28",
            spec4: "Max: 35",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: ""
          },
          {
            id: "3",
            spec1: "Kesuaian Zona Gempa",
            spec2: "Zona : 3",
            spec3: "",
            spec4: "",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: ""
          },
          {
            id: "4",
            spec1: "",
            spec2: "",
            spec3: "",
            spec4: "",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: ""
          }
        ]
      },
      {
        id: "approval-standards",
        title: "APPROVAL STANDARDS",
        number: "5",
        items: [
          {
            id: "6",
            spec1: "Standard",
            spec2: "ANSI / IEEE / IEC / JIS / DIN/VDE",
            spec3: "",
            spec4: "",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: ""
          },
          {
            id: "7",
            spec1: "",
            spec2: "",
            spec3: "",
            spec4: "",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: ""
          }
        ]
      },
      {
        id: "stationary-battery-specification",
        title: "STATIONARY BATTERY SPECIFICATION",
        number: "8",
        items: [
          {
            id: "9",
            spec1: "Tipe Sel",
            spec2: "OPzS",
            spec3: "",
            spec4: "",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: "",
            mergeSpec1Rows: 8 // This cell spans 8 rows (9-16)
          },
          {
            id: "10",
            spec1: "", // Empty because merged with row 9
            spec2: "Plate",
            spec3: "Positif: TUBULAR",
            spec4: "Negatif: GRID",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: ""
          },
          {
            id: "11",
            spec1: "", // Empty because merged with row 9
            spec2: "Lead Alloying",
            spec3: "Low Antimony",
            spec4: "0,5 – 1 %",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: ""
          },
          {
            id: "12",
            spec1: "", // Empty because merged with row 9
            spec2: "Container",
            spec3: "High Quality Transparent Electrolyte Proof Material (AcryloNitrile-Styrene)",
            spec4: "Black Color container is NOT APPROVED",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: ""
          },
          {
            id: "13",
            spec1: "", // Empty because merged with row 9
            spec2: "Number of Poles Terminal",
            spec3: "Positif: Min. 3 pcs",
            spec4: "Negatif: Min. 3 pcs",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: ""
          },
          {
            id: "14",
            spec1: "", // Empty because merged with row 9
            spec2: "Electrolyte Specific Grafity (SG)",
            spec3: "1.22 atau 1.24",
            spec4: "At 25 °C",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: ""
          },
          {
            id: "15",
            spec1: "", // Empty because merged with row 9
            spec2: "Full Charge Electrolyte Specific Gravity (SG)",
            spec3: "1,27",
            spec4: "At 25 °C",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: ""
          },
          {
            id: "16",
            spec1: "", // Empty because merged with row 9
            spec2: "Design Life Time",
            spec3: "Min 20 years (Certified Letter by Manufacture)",
            spec4: "At 20 °C",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: ""
          },
          {
            id: "17",
            spec1: "Minimum Kapasitas (Ampere Hours):",
            spec2: "2000 Ah (C10)",
            spec3: "",
            spec4: "",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: ""
          },
          {
            id: "18",
            spec1: "Tegangan Nominal/Cell : 2 Volt",
            spec2: "Tegangan Float Cell : 2,2 Volt",
            spec3: "Tegangan Equalize (Boost) Cell : 2,25 V",
            spec4: "",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: ""
          },
          {
            id: "19",
            spec1: "End Voltage per Cell (Battery Design)",
            spec2: "Minimum 1,80 Volts",
            spec3: "End Voltage yang menyatakan battery sudah rusak.",
            spec4: "",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: ""
          },
          {
            id: "20",
            spec1: "End Voltage per Cell at Commissioning/ Acceptance Test",
            spec2: "Minimum 1,85 Volts",
            spec3: "Metode Test C10 (200 A 10 jam). Test dilakukan Vendor termasuk alat dummy load, charging, dll disediakan oleh Vendor.",
            spec4: "",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: ""
          },
          {
            id: "21",
            spec1: "Metode Pengiriman:",
            spec2: "Kering",
            spec3: "Dry Pre-Charged for Un-Limited Time Storage",
            spec4: "",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: ""
          },
          {
            id: "22",
            spec1: "Jumlah Discharge Cycles",
            spec2: "Minimal 1000 Cycle (Certified Letter by Manufacture)",
            spec3: "",
            spec4: "",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: ""
          },
          {
            id: "23",
            spec1: "",
            spec2: "",
            spec3: "",
            spec4: "",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: ""
          },
          {
            id: "24",
            spec1: "KESESUAIAN DENGAN LOAD CHARACTERISTIC (End Voltage 1,80 VPC Back-Up Time 10 hours)",
            spec2: "",
            spec3: "",
            spec4: "",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: ""
          },
          {
            id: "25",
            spec1: "Batere harus dapat memenuhi load karakteristik berikut:",
            spec2: "",
            spec3: "",
            spec4: "",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: ""
          },
          {
            id: "26",
            spec1: "",
            spec2: "",
            spec3: "",
            spec4: "",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: ""
          }
        ]
      },
      {
        id: "battery-rack-specification",
        title: "BATTERY RACK SPECIFICATION",
        number: "27",
        items: [
          {
            id: "28",
            spec1: "MATERIAL",
            spec2: "CARBON STEEL DICAT DENGAN ANTI ACID COATING DAN DI BAWAH BATTERY DILENGKAPI DENGAN INSULATORS, CROSS BEAMS DAN WOOD STRIPS",
            spec3: "ANTI SEISMIC BATTERY RACK (TAHAN GEMPA)",
            spec4: "",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: ""
          },
          {
            id: "29",
            spec1: "",
            spec2: "",
            spec3: "",
            spec4: "",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: ""
          }
        ]
      },
      {
        id: "accessories",
        title: "ACCESSORIES",
        number: "30",
        items: [
          {
            id: "31",
            spec1: "Hydrometer Portabel",
            spec2: "Diperlukan 2 buah",
            spec3: "",
            spec4: "",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: ""
          },
          {
            id: "32",
            spec1: "Hydrometer Vent-Mounted",
            spec2: "Diperlukan 2 buah",
            spec3: "",
            spec4: "",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: ""
          },
          {
            id: "33",
            spec1: "Thermometer Vent-Mounted",
            spec2: "Diperlukan sebanyak jumlah battery yang diminta (±110 buah)",
            spec3: "",
            spec4: "",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: ""
          },
          {
            id: "34",
            spec1: "Pengangkat Sel Portable (Lifting Truck)",
            spec2: "Diperlukan 1 set",
            spec3: "",
            spec4: "",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: ""
          },
          {
            id: "35",
            spec1: "Portable Charger smooth selector 2 - 12 Volt continous current 200 Ampere",
            spec2: "Diperlukan 1 set",
            spec3: "",
            spec4: "",
            vendorPTX: "",
            vendorPTY: "",
            vendorPTZ: "",
            keterangan: ""
          }
        ]
      }
    ]
  },
  // ITP, DRS, PGRS use default format (empty arrays)
  inspectionTestingPlans: [],
  documentRequestSheets: [],
  performanceGuarantees: []
};

module.exports = batteryTemplateData;
