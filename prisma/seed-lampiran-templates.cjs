// Quick script to seed only lampiran templates
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Lampiran Templates...");

  const templates = [
    {
      name: "Arrester",
      description: "150 kV Lightning Arrester Template",
      // Column configuration for TPG table
      tpgColumns: [
        { key: "description", label: "DESCRIPTION", width: "40%" },
        { key: "specified", label: "SPECIFIED", width: "30%" },
        { key: "proposedGuarantee", label: "PROPOSED & GUARANTEE", width: "30%" }
      ],
      technicalParticulars: [
        // Section 1: Spec Arrester
        { id: "1-0", description: "SPEC ARRESTER" },
        { id: "1-1", description: "Standard Reference", specified: "IEC latest version (IEC 99)", proposedGuarantee: "" },
        { id: "1-2", description: "Number of Requirement", specified: "3 Pcs.", proposedGuarantee: "" },
        { id: "1-3", description: "Surge Arrester", specified: "170 kV", proposedGuarantee: "" },
        { id: "1-4", description: "MCOV", specified: "115 kV", proposedGuarantee: "" },
        { id: "1-5", description: "Ur", specified: "144 kV", proposedGuarantee: "" },
        { id: "1-6", description: "Line Discharge Current", specified: "20 kA", proposedGuarantee: "" },
        { id: "1-7", description: "Line Discharge Class", specified: "4", proposedGuarantee: "" },
        { id: "1-8", description: "Insulated Base", specified: "Yes Required", proposedGuarantee: "" },
        { id: "1-9", description: "Line terminal & Earth terminal", specified: "Yes Required", proposedGuarantee: "" },
        { id: "1-10", description: "Type", specified: "Porcelain", proposedGuarantee: "" },
        { id: "1-11", description: "Element", specified: "Zinc Oxide", proposedGuarantee: "" },
        { id: "1-12", description: "Grading Ring", specified: "Yes Required", proposedGuarantee: "" },
        { id: "1-13", description: "Pollutant Index", specified: "IV (Very Heavy Pollutant)", proposedGuarantee: "" },
        { id: "1-14", description: "Creepage Distance", specified: "31 mm/kV or more", proposedGuarantee: "" },
        { id: "1-15", description: "Power Voltage Range Freq", specified: "47 - 55 Hz", proposedGuarantee: "" },
        { id: "1-16", description: "Ambient Temp", specified: "20 – 40°C (Tropical Zone)", proposedGuarantee: "" },
        { id: "1-17", description: "Altitude", specified: "2 m", proposedGuarantee: "" },
        { id: "1-18", description: "Earth Quake Level", specified: "min 8 Ritcher Scale", proposedGuarantee: "" },
        { id: "1-19", description: "Country Origin", specified: "West Europe,Japan or USA", proposedGuarantee: "" },
        
        // Section 2: Spec Counter LA
        { id: "2-0", description: "SPEC COUNTER LA" },
        { id: "2-1", description: "Minimum Operating Current", specified: "10 kA (8/20 us)", proposedGuarantee: "" },
        { id: "2-2", description: "Max High Current Withstand Capability", specified: "100 kA (8/10 us)", proposedGuarantee: "" },
        { id: "2-3", description: "Measurement of Total Leakage current", specified: "0,2 – 20 mA (Ampere linear scale 0 – 5 mA rms)", proposedGuarantee: "" },
        { id: "2-4", description: "Measurement Range Frequency", specified: "47 – 55 Hz", proposedGuarantee: "" },
        { id: "2-5", description: "Country Origin", specified: "West Europe,Japan or USA", proposedGuarantee: "" },
        
        // Section 3: Inspection & Testing Requirement at Factory
        { id: "3-0", description: "Inspection & Testing Requirement at Factory" },
        { id: "3-1", description: "Insulation Withstand Test", specified: "IEC 60099-4 & IEC 37/268/FDIS", proposedGuarantee: "" },
        { id: "3-2", description: "Discharge Voltage Test", specified: "IEC 60099-4 & IEC 37/268/FDIS", proposedGuarantee: "" },
        { id: "3-3", description: "RIV Tes", specified: "IEC 60099-4 & IEC 37/268/FDIS", proposedGuarantee: "" },
        { id: "3-4", description: "Operation Duty Cycle Test", specified: "IEC 60099-4 & IEC 37/268/FDIS", proposedGuarantee: "" },
        { id: "3-5", description: "Long Duration Test", specified: "IEC 60099-4 & IEC 37/268/FDIS", proposedGuarantee: "" },
        { id: "3-6", description: "Internal Partial Discharge Test", specified: "IEC 60099-4 & IEC 37/268/FDIS", proposedGuarantee: "" },
        
        // Section 4: Inspection & Testing Requirement at Site (WITNESS)
        { id: "4-0", description: "Inspection & Testing Requirement at Site (WITNESS)" },
        { id: "4-1", description: "Insulation Withstand Test Record", specified: "IEC 60099-4 & IEC 37/268/FDIS", proposedGuarantee: "" },
        { id: "4-2", description: "Current Leakage Test", specified: "IEC 60099-4 & IEC 37/268/FDIS", proposedGuarantee: "" },
        
        // Section 5: Documents Requirement
        { id: "5-0", description: "Documents Requirement" },
        { id: "5-1", description: "Insulation Withstand Test Record", specified: "Required", proposedGuarantee: "" },
        { id: "5-2", description: "Discharge Voltage Test Record", specified: "Required", proposedGuarantee: "" },
        { id: "5-3", description: "RIV Tes Record", specified: "Required", proposedGuarantee: "" },
        { id: "5-4", description: "Operation Duty Cycle Test Record", specified: "Required", proposedGuarantee: "" },
        { id: "5-5", description: "Temporary Over Voltage Test Record", specified: "Required", proposedGuarantee: "" },
        { id: "5-6", description: "Internal Partial Discharge Test Record", specified: "Required", proposedGuarantee: "" },
        { id: "5-7", description: "Specification, Operation & Maintenance Manual", specified: "Required", proposedGuarantee: "" },
      ],
      inspectionTestingPlans: [],
      documentRequestSheets: [],
      performanceGuarantees: [],
    },
    {
      name: "AVR",
      description: "Automatic Voltage Regulator Template",
      tpgColumns: [
        { key: "description", label: "DESCRIPTION", width: "25%" },
        { key: "unit", label: "UNIT", width: "10%" },
        { key: "required", label: "REQUIRED", width: "20%" },
        { key: "proposedGuaranteed", label: "PROPOSED AND GUARANTEED", width: "25%" },
        { key: "remarks", label: "REMARKS", width: "20%" }
      ],
      technicalParticulars: require('./avr-template-data.cjs'),
      inspectionTestingPlans: [],
      documentRequestSheets: [],
      performanceGuarantees: [],
    },
    {
      name: "Battery",
      description: "Battery System Template",
      technicalParticulars: [
        { id: "1", specification: "Type", ownerRequest: "VRLA/Flooded", vendorProposed: "" },
        { id: "2", specification: "Nominal Voltage", ownerRequest: "110 VDC", vendorProposed: "" },
        { id: "3", specification: "Capacity", ownerRequest: "200 Ah @ 8hr rate", vendorProposed: "" },
        { id: "4", specification: "Design Life", ownerRequest: "≥ 10 years", vendorProposed: "" },
      ],
      inspectionTestingPlans: [],
      documentRequestSheets: [],
      performanceGuarantees: [],
    },
    {
      name: "MTU Peralatan Tegangan Tinggi",
      description: "High Voltage Equipment Template",
      technicalParticulars: [
        { id: "1", specification: "Rated Voltage", ownerRequest: "150 kV", vendorProposed: "" },
        { id: "2", specification: "BIL", ownerRequest: "650 kV", vendorProposed: "" },
        { id: "3", specification: "Rated Current", ownerRequest: "1250 A", vendorProposed: "" },
        { id: "4", specification: "Insulation Level", ownerRequest: "Class II", vendorProposed: "" },
      ],
      inspectionTestingPlans: [],
      documentRequestSheets: [],
      performanceGuarantees: [],
    },
    {
      name: "MV Induction Motor",
      description: "Medium Voltage Induction Motor Template",
      technicalParticulars: [
        { id: "1", specification: "Rated Power", ownerRequest: "500 kW", vendorProposed: "" },
        { id: "2", specification: "Voltage", ownerRequest: "6.6 kV", vendorProposed: "" },
        { id: "3", specification: "Speed", ownerRequest: "1480 rpm", vendorProposed: "" },
        { id: "4", specification: "Efficiency", ownerRequest: "≥ 95%", vendorProposed: "" },
      ],
      inspectionTestingPlans: [],
      documentRequestSheets: [],
      performanceGuarantees: [],
    },
    {
      name: "Oil Power Transformer",
      description: "Oil Power Transformer Template",
      technicalParticulars: [
        { id: "1", specification: "Rated Capacity", ownerRequest: "50 MVA", vendorProposed: "" },
        { id: "2", specification: "Voltage Ratio", ownerRequest: "150/20 kV", vendorProposed: "" },
        { id: "3", specification: "Cooling Type", ownerRequest: "ONAN/ONAF", vendorProposed: "" },
        { id: "4", specification: "Impedance", ownerRequest: "12% ± 10%", vendorProposed: "" },
      ],
      inspectionTestingPlans: [],
      documentRequestSheets: [],
      performanceGuarantees: [],
    },
    {
      name: "Power Kabel",
      description: "Power Cable Template",
      technicalParticulars: [
        { id: "1", specification: "Type", ownerRequest: "XLPE Insulated", vendorProposed: "" },
        { id: "2", specification: "Voltage Rating", ownerRequest: "20 kV", vendorProposed: "" },
        { id: "3", specification: "Conductor Size", ownerRequest: "240 mm²", vendorProposed: "" },
        { id: "4", specification: "Number of Cores", ownerRequest: "3C", vendorProposed: "" },
      ],
      inspectionTestingPlans: [],
      documentRequestSheets: [],
      performanceGuarantees: [],
    },
    {
      name: "Relay Proteksi",
      description: "Protection Relay Template",
      technicalParticulars: [
        { id: "1", specification: "Type", ownerRequest: "Numerical/Microprocessor", vendorProposed: "" },
        { id: "2", specification: "Functions", ownerRequest: "ANSI 50/51/87", vendorProposed: "" },
        { id: "3", specification: "CT Input", ownerRequest: "1A / 5A", vendorProposed: "" },
        { id: "4", specification: "Communication", ownerRequest: "IEC 61850", vendorProposed: "" },
      ],
      inspectionTestingPlans: [],
      documentRequestSheets: [],
      performanceGuarantees: [],
    },
    {
      name: "UPS",
      description: "Uninterruptible Power Supply Template",
      technicalParticulars: [
        { id: "1", specification: "Capacity", ownerRequest: "100 kVA", vendorProposed: "" },
        { id: "2", specification: "Topology", ownerRequest: "Online Double Conversion", vendorProposed: "" },
        { id: "3", specification: "Input Voltage", ownerRequest: "380-480 VAC", vendorProposed: "" },
        { id: "4", specification: "Backup Time", ownerRequest: "30 minutes @ full load", vendorProposed: "" },
      ],
      inspectionTestingPlans: [],
      documentRequestSheets: [],
      performanceGuarantees: [],
    },
  ];

  for (const template of templates) {
    await prisma.lampiranTemplate.upsert({
      where: { name: template.name },
      update: {
        description: template.description,
        tpgColumns: template.tpgColumns,
        itpColumns: template.itpColumns,
        drsColumns: template.drsColumns,
        pgrsColumns: template.pgrsColumns,
        technicalParticulars: template.technicalParticulars,
        inspectionTestingPlans: template.inspectionTestingPlans,
        documentRequestSheets: template.documentRequestSheets,
        performanceGuarantees: template.performanceGuarantees,
      },
      create: template,
    });
    console.log(`  ✓ Template: ${template.name}`);
  }

  console.log("✅ Lampiran Templates seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
