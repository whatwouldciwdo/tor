// prisma/seed.cjs
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// helper posisi: cari berdasarkan name, kalau belum ada → create
async function ensurePositionByName(name, data) {
  const existing = await prisma.position.findFirst({ where: { name } });
  if (existing) return existing;
  return prisma.position.create({ data });
}

async function main() {
  console.log("Seeding start...");

  // 1. Roles (Role Sistem)
  const roleNames = [
    "SUPER_ADMIN",
    "CREATOR",
    "EDITOR",
    "APPROVAL_1",
    "APPROVAL_2",
    "APPROVAL_3",
    "APPROVAL_4",
    "REVISE",
    "EXPORT",
  ];

  const roles = {};
  for (const name of roleNames) {
    const role = await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    roles[name] = role;
  }
  console.log("Roles seeded");

  // 2. Bidang
  const outageBidang = await prisma.bidang.upsert({
    where: { code: "OUTAGE" },
    update: {},
    create: {
      name: "Bidang Outage",
      code: "OUTAGE",
    },
  });

  const harLisBidang = await prisma.bidang.upsert({
    where: { code: "HAR_LIS" },
    update: {},
    create: {
      name: "Bidang Pemeliharaan Listrik",
      code: "HAR_LIS",
    },
  });

  const harMecBidang = await prisma.bidang.upsert({
    where: { code: "HAR_MEC" },
    update: {},
    create: {
      name: "Bidang Pemeliharaan Mesin",
      code: "HAR_MEC",
    },
  });

  const harBopBidang = await prisma.bidang.upsert({
    where: { code: "HAR_BOP" },
    update: {},
    create: {
      name: "Bidang Pemeliharaan BOP",
      code: "HAR_BOP",
    },
  });

  const k3Bidang = await prisma.bidang.upsert({
    where: { code: "K3" },
    update: {},
    create: {
      name: "Bidang K3",
      code: "K3",
    },
  });

  const umumBidang = await prisma.bidang.upsert({
    where: { code: "UMUM" },
    update: {},
    create: {
      name: "Bidang Umum",
      code: "UMUM",
    },
  });

  const harInsBidang = await prisma.bidang.upsert({
    where: { code: "HAR_INC" },
    update: {},
    create: {
      name: "Bidang Pemeliharaan Instrumen",
      code: "HAR_INC",
    },
  });

  console.log("All Bidang seeded");

  // 3. Positions (jabatan)

  // --- Super Admin (global) ---
  const superAdminPosition = await ensurePositionByName("Super Admin", {
    name: "Super Admin",
    isGlobal: true,
    isActive: true,
  });

  // =========================
  // CREATOR GROUP PER BIDANG
  // =========================

  // Outage
  const soBoiler = await ensurePositionByName(
    "SENIOR OFFICER ENJINIRING BOILER DAN HRSG UBP CLG",
    {
      name: "SENIOR OFFICER ENJINIRING BOILER DAN HRSG UBP CLG",
      bidangId: outageBidang.id,
      levelOrder: 1,
    }
  );

  const officerOutage = await ensurePositionByName(
    "OFFICER PERENCANAAN OUTAGE CLG PGU",
    {
      name: "OFFICER PERENCANAAN OUTAGE CLG PGU",
      bidangId: outageBidang.id,
      levelOrder: 2,
    }
  );

  // Bidang Pemeliharaan Listrik
  const soHarLis = await ensurePositionByName(
    "SENIOR OFFICER ENJINIRING LISTRIK UBP CLG",
    {
      name: "SENIOR OFFICER ENJINIRING LISTRIK UBP CLG",
      bidangId: harLisBidang.id,
      levelOrder: 1,
    }
  );

  const tlHarLis = await ensurePositionByName(
    "TEAM LEADER PEMELIHARAAN LISTRIK UNIT DAN BOP UBP CLG",
    {
      name: "TEAM LEADER PEMELIHARAAN LISTRIK UNIT DAN BOP UBP CLG",
      bidangId: harLisBidang.id,
      levelOrder: 2,
    }
  );

  // Bidang Pemeliharaan Mesin
  const soHarMec = await ensurePositionByName(
    "SENIOR OFFICER ENJINIRING LISTRIK UBP CLG",
    {
      // sesuai spesifikasi kamu: creator mesin pakai SO & TL Listrik
      name: "SENIOR OFFICER ENJINIRING LISTRIK UBP CLG",
      bidangId: harMecBidang.id,
      levelOrder: 1,
    }
  );

  const soTurbineMesin = await ensurePositionByName(
    "SENIOR OFFICER ENJINIRING TURBIN DAN GENERATOR UBP CLG",
    {
      name: "SENIOR OFFICER ENJINIRING TURBIN DAN GENERATOR UBP CLG",
      bidangId: harMecBidang.id,
      levelOrder: 1,
    }
  );

  const tlHarMec = await ensurePositionByName(
    "TEAM LEADER PEMELIHARAAN LISTRIK UNIT DAN BOP UBP CLG",
    {
      name: "TEAM LEADER PEMELIHARAAN LISTRIK UNIT DAN BOP UBP CLG",
      bidangId: harMecBidang.id,
      levelOrder: 2,
    }
  );

  const tlMesin = await ensurePositionByName(
    "TEAM LEADER PEMELIHARAAN MESIN UBP CLG",
    {
      name: "TEAM LEADER PEMELIHARAAN MESIN UBP CLG",
      bidangId: harMecBidang.id,
      levelOrder: 2,
    }
  );

  // Bidang Pemeliharaan BOP
  const soHarBop = await ensurePositionByName(
    "SENIOR OFFICER ENJINIRING BOP UBP CLG",
    {
      name: "SENIOR OFFICER ENJINIRING BOP UBP CLG",
      bidangId: harBopBidang.id,
      levelOrder: 1,
    }
  );

  const officerBop = await ensurePositionByName("OFFICER BOP", {
    name: "OFFICER BOP",
    bidangId: harBopBidang.id,
    levelOrder: 2,
  });

  const tlBop = await ensurePositionByName(
    "TEAM LEADER PEMELIHARAAN MESIN BOP, BENGKEL DAN TOOLS UBP CLG",
    {
      name: "TEAM LEADER PEMELIHARAAN MESIN BOP, BENGKEL DAN TOOLS UBP CLG",
      bidangId: harBopBidang.id,
      levelOrder: 2,
    }
  );

  // Bidang K3
  const soK3 = await ensurePositionByName(
    "SENIOR OFFICER ENJINIRING KIMIA, K3 DAN LINGKUNGAN UBP CLG",
    {
      name: "SENIOR OFFICER ENJINIRING KIMIA, K3 DAN LINGKUNGAN UBP CLG",
      bidangId: k3Bidang.id,
      levelOrder: 1,
    }
  );

  const officerK3 = await ensurePositionByName("OFFICER K3 UBP CLG", {
    name: "OFFICER K3 UBP CLG",
    bidangId: k3Bidang.id,
    levelOrder: 2,
  });

  // Bidang Pemeliharaan Instrumen
  const soHarIns = await ensurePositionByName(
    "SENIOR OFFICER ENJINIRING KONTROL DAN INSTRUMEN UBP CLG",
    {
      name: "SENIOR OFFICER ENJINIRING KONTROL DAN INSTRUMEN UBP CLG",
      bidangId: harInsBidang.id,
      levelOrder: 1,
    }
  );

  const tlHarIns = await ensurePositionByName(
    "TEAM LEADER PEMELIHARAAN KONTROL DAN INSTRUMEN UNIT DAN BOP UBP CLG",
    {
      name: "TEAM LEADER PEMELIHARAAN KONTROL DAN INSTRUMEN UNIT DAN BOP UBP CLG",
      bidangId: harInsBidang.id,
      levelOrder: 2,
    }
  );

  // Bidang Umum → Asman Umum & Officer Umum sebagai Creator
  const asmanUmum = await ensurePositionByName(
    "ASSISTANT MANAGER UMUM UBP CLG",
    {
      name: "ASSISTANT MANAGER UMUM UBP CLG",
      bidangId: umumBidang.id,
      levelOrder: 1,
    }
  );

  const officerUmum = await ensurePositionByName("OFFICER UMUM", {
    name: "OFFICER UMUM",
    bidangId: umumBidang.id,
    levelOrder: 2,
  });

  // =========================
  // APPROVAL CHAIN POSITIONS
  // =========================

  // Approval 1 per bidang
  const asmanOutage = await ensurePositionByName(
    "ASSISTANT MANAGER PERENCANAAN DAN PENGENDALIAN PEMELIHARAAN DAN INVENTORY UBP CLG",
    {
      name: "ASSISTANT MANAGER PERENCANAAN DAN PENGENDALIAN PEMELIHARAAN DAN INVENTORY UBP CLG",
      bidangId: outageBidang.id,
      levelOrder: 3,
    }
  );

  const asmanHarLis = await ensurePositionByName(
    "ASSISTANT MANAGER PEMELIHARAAN LISTRIK, KONTROL DAN INSTRUMEN UBP CLG",
    {
      name: "ASSISTANT MANAGER PEMELIHARAAN LISTRIK, KONTROL DAN INSTRUMEN UBP CLG",
      bidangId: harLisBidang.id,
      levelOrder: 3,
    }
  );

  const asmanHarMec = await ensurePositionByName(
    "ASSISTANT MANAGER PEMELIHARAAN MESIN UBP CLG",
    {
      name: "ASSISTANT MANAGER PEMELIHARAAN MESIN UBP CLG",
      bidangId: harMecBidang.id,
      levelOrder: 3,
    }
  );

  const asmanHarBop = await ensurePositionByName(
    "ASSISTANT MANAGER PEMELIHARAAN MESIN UBP CLG",
    {
      name: "ASSISTANT MANAGER PEMELIHARAAN MESIN UBP CLG",
      bidangId: harBopBidang.id,
      levelOrder: 3,
    }
  );

  const asmanK3 = await ensurePositionByName(
    "ASSISTANT MANAGER K3 DAN LINGKUNGAN UBP CLG",
    {
      name: "ASSISTANT MANAGER K3 DAN LINGKUNGAN UBP CLG",
      bidangId: k3Bidang.id,
      levelOrder: 3,
    }
  );

  // Approval 2 khusus Umum
  const madm = await ensurePositionByName("MANAGER ADMINISTRASI UBP CLG", {
    name: "MANAGER ADMINISTRASI UBP CLG",
    bidangId: umumBidang.id,
    levelOrder: 4,
  });

  // Manager Pemeliharaan (Approval 3 Outage)
  const managerPemeliharaan = await ensurePositionByName(
    "MANAGER PEMELIHARAAN UBP CLG",
    {
      name: "MANAGER PEMELIHARAAN UBP CLG",
      bidangId: outageBidang.id,
      levelOrder: 5,
    }
  );

  // ===== GLOBAL POSITIONS =====

  const asmanLim = await ensurePositionByName(
    "ASSISTANT MANAGER LIM LIFE CYCLE MANAGEMENT, INVESTASI DAN MANAJEMEN RISIKO UBP CLG",
    {
      name: "ASSISTANT MANAGER LIM LIFE CYCLE MANAGEMENT, INVESTASI DAN MANAJEMEN RISIKO UBP CLG",
      isGlobal: true,
      levelOrder: 4,
    }
  );

  const meng = await ensurePositionByName("MANAGER ENJINIRING UBP CLG", {
    name: "MANAGER ENJINIRING UBP CLG",
    isGlobal: true,
    levelOrder: 6,
  });

  const pengadaan = await ensurePositionByName(
    "ASSISTANT MANAGER PENGADAAN BARANG DAN JASA UBP CLG",
    {
      name: "ASSISTANT MANAGER PENGADAAN BARANG DAN JASA UBP CLG",
      isGlobal: true,
      levelOrder: 7,
    }
  );

  console.log("Positions seeded");

  // 4. Mapping Position -> Role (positionRoles)
  const mappings = [
    // === CREATOR group tiap bidang ===
    // Outage
    { positionId: soBoiler.id, roleNames: ["CREATOR", "EDITOR"] },
    { positionId: officerOutage.id, roleNames: ["CREATOR", "EDITOR"] },

    // HAR Listrik
    { positionId: soHarLis.id, roleNames: ["CREATOR", "EDITOR"] },
    { positionId: tlHarLis.id, roleNames: ["CREATOR", "EDITOR"] },

    // HAR MEC
    { positionId: soHarMec.id, roleNames: ["CREATOR", "EDITOR"] },
    { positionId: soTurbineMesin.id, roleNames: ["CREATOR", "EDITOR"] },
    { positionId: tlHarMec.id, roleNames: ["CREATOR", "EDITOR"] },
    { positionId: tlMesin.id, roleNames: ["CREATOR", "EDITOR"] },

    // HAR BOP
    { positionId: soHarBop.id, roleNames: ["CREATOR", "EDITOR"] },
    { positionId: officerBop.id, roleNames: ["CREATOR", "EDITOR"] },
    { positionId: tlBop.id, roleNames: ["CREATOR", "EDITOR"] },

    // K3
    { positionId: soK3.id, roleNames: ["CREATOR", "EDITOR"] },
    { positionId: officerK3.id, roleNames: ["CREATOR", "EDITOR"] },

    // HAR Instrumen
    { positionId: soHarIns.id, roleNames: ["CREATOR", "EDITOR"] },
    { positionId: tlHarIns.id, roleNames: ["CREATOR", "EDITOR"] },

    // Umum
    { positionId: asmanUmum.id, roleNames: ["CREATOR", "EDITOR"] },
    { positionId: officerUmum.id, roleNames: ["CREATOR", "EDITOR"] },

    // === APPROVAL CHAIN ===
    // Approval 1 + Editor per bidang
    { positionId: asmanOutage.id, roleNames: ["APPROVAL_1", "EDITOR"] },
    { positionId: asmanHarLis.id, roleNames: ["APPROVAL_1", "EDITOR"] },
    { positionId: asmanHarMec.id, roleNames: ["APPROVAL_1", "EDITOR"] },
    { positionId: asmanHarBop.id, roleNames: ["APPROVAL_1", "EDITOR"] },
    { positionId: asmanK3.id, roleNames: ["APPROVAL_1", "EDITOR"] },

    // Asman Lim (GLOBAL):
    // - Approval 2 untuk semua bidang teknis
    // - Approval 1 di Bidang Umum
    // - EXPORT: dapat export TOR dokumen
    {
      positionId: asmanLim.id,
      roleNames: ["APPROVAL_1", "APPROVAL_2", "EDITOR", "REVISE", "EXPORT"],
    },

    // Manager Pemeliharaan (Outage) → Approval 3 + REVISE
    { positionId: managerPemeliharaan.id, roleNames: ["APPROVAL_3", "REVISE"] },

    // MADM (Umum) → Approval 2 + REVISE
    { positionId: madm.id, roleNames: ["APPROVAL_2", "REVISE"] },

    // MENG (GLOBAL) → Approval 3 / 4 + REVISE + EXPORT
    {
      positionId: meng.id,
      roleNames: ["APPROVAL_3", "APPROVAL_4", "REVISE", "EXPORT"],
    },

    // Pengadaan global → Approval 4 + REVISE + EXPORT
    {
      positionId: pengadaan.id,
      roleNames: ["APPROVAL_4", "REVISE", "EXPORT"],
    },

    // Super Admin
    { positionId: superAdminPosition.id, roleNames: ["SUPER_ADMIN"] },
  ];

  for (const map of mappings) {
    for (const roleName of map.roleNames) {
      const role = roles[roleName];
      await prisma.positionRole.upsert({
        where: {
          positionId_roleId: {
            positionId: map.positionId,
            roleId: role.id,
          },
        },
        update: {},
        create: {
          positionId: map.positionId,
          roleId: role.id,
        },
      });
    }
  }
  console.log("PositionRoles seeded");

  // 5. Workflows per Bidang

  // 5.1 Workflow Outage
  const outageWorkflow = await prisma.workflow.upsert({
    where: { bidangId: outageBidang.id },
    update: {},
    create: {
      name: "Workflow TOR Bidang Outage",
      bidangId: outageBidang.id,
    },
  });

  // Outage: Asman Outage → Asman Lim → Manager Pemeliharaan → MENG → Pengadaan (4.1)
  await prisma.workflowStep.upsert({
    where: {
      workflowId_stepNumber: {
        workflowId: outageWorkflow.id,
        stepNumber: 1,
      },
    },
    update: {},
    create: {
      workflowId: outageWorkflow.id,
      stepNumber: 1,
      label: "Approval 1 (Asman Outage)",
      positionId: asmanOutage.id,
      statusStage: "APPROVAL_1",
      canRevise: true,
      revisionTargetStep: 0,
    },
  });

  await prisma.workflowStep.upsert({
    where: {
      workflowId_stepNumber: {
        workflowId: outageWorkflow.id,
        stepNumber: 2,
      },
    },
    update: {},
    create: {
      workflowId: outageWorkflow.id,
      stepNumber: 2,
      label: "Approval 2 (Asman Lim)",
      positionId: asmanLim.id,
      statusStage: "APPROVAL_2",
      canRevise: true,
      revisionTargetStep: 0,
    },
  });

  await prisma.workflowStep.upsert({
    where: {
      workflowId_stepNumber: {
        workflowId: outageWorkflow.id,
        stepNumber: 3,
      },
    },
    update: {},
    create: {
      workflowId: outageWorkflow.id,
      stepNumber: 3,
      label: "Approval 3 (Manager Pemeliharaan)",
      positionId: managerPemeliharaan.id,
      statusStage: "APPROVAL_3",
      canRevise: true,
      revisionTargetStep: 0,
    },
  });

  await prisma.workflowStep.upsert({
    where: {
      workflowId_stepNumber: {
        workflowId: outageWorkflow.id,
        stepNumber: 4,
      },
    },
    update: {},
    create: {
      workflowId: outageWorkflow.id,
      stepNumber: 4,
      label: "Approval 4 (Manager Enjiniring)",
      positionId: meng.id,
      statusStage: "APPROVAL_4",
      canRevise: true,
      revisionTargetStep: 0,
    },
  });

  await prisma.workflowStep.upsert({
    where: {
      workflowId_stepNumber: {
        workflowId: outageWorkflow.id,
        stepNumber: 5,
      },
    },
    update: {},
    create: {
      workflowId: outageWorkflow.id,
      stepNumber: 5,
      label: "Approval 4.1 (Pengadaan)",
      positionId: pengadaan.id,
      statusStage: "APPROVAL_4_1",
      canRevise: true,
      revisionTargetStep: 0,
      isLastStep: true,
    },
  });

  console.log("Workflow for Outage seeded");

  // Helper untuk workflow standar (Asman Bidang → Asman Lim → MENG → Pengadaan)
  async function seedStandardWorkflow({
    bidang,
    name,
    asmanPosition,
  }) {
    const wf = await prisma.workflow.upsert({
      where: { bidangId: bidang.id },
      update: {},
      create: {
        name,
        bidangId: bidang.id,
      },
    });

    await prisma.workflowStep.upsert({
      where: {
        workflowId_stepNumber: {
          workflowId: wf.id,
          stepNumber: 1,
        },
      },
      update: {},
      create: {
        workflowId: wf.id,
        stepNumber: 1,
        label: "Approval 1 (Asman Bidang)",
        positionId: asmanPosition.id,
        statusStage: "APPROVAL_1",
        canRevise: true,
        revisionTargetStep: 0,
      },
    });

    await prisma.workflowStep.upsert({
      where: {
        workflowId_stepNumber: {
          workflowId: wf.id,
          stepNumber: 2,
        },
      },
      update: {},
      create: {
        workflowId: wf.id,
        stepNumber: 2,
        label: "Approval 2 (Asman Lim)",
        positionId: asmanLim.id,
        statusStage: "APPROVAL_2",
        canRevise: true,
        revisionTargetStep: 0,
      },
    });

    await prisma.workflowStep.upsert({
      where: {
        workflowId_stepNumber: {
          workflowId: wf.id,
          stepNumber: 3,
        },
      },
      update: {},
      create: {
        workflowId: wf.id,
        stepNumber: 3,
        label: "Approval 3 (Manager Enjiniring)",
        positionId: meng.id,
        statusStage: "APPROVAL_3",
        canRevise: true,
        revisionTargetStep: 0,
      },
    });

    await prisma.workflowStep.upsert({
      where: {
        workflowId_stepNumber: {
          workflowId: wf.id,
          stepNumber: 4,
        },
      },
      update: {},
      create: {
        workflowId: wf.id,
        stepNumber: 4,
        label: "Approval 4 (Pengadaan)",
        positionId: pengadaan.id,
        statusStage: "APPROVAL_4",
        canRevise: true,
        revisionTargetStep: 0,
        isLastStep: true,
      },
    });

    return wf;
  }

  // 5.2 Workflow HAR Listrik
  await seedStandardWorkflow({
    bidang: harLisBidang,
    name: "Workflow TOR Bidang Pemeliharaan Listrik",
    asmanPosition: asmanHarLis,
  });
  console.log("Workflow for HAR Listrik seeded");

  // 5.3 Workflow HAR MEC
  await seedStandardWorkflow({
    bidang: harMecBidang,
    name: "Workflow TOR Bidang Pemeliharaan Mesin",
    asmanPosition: asmanHarMec,
  });
  console.log("Workflow for HAR MEC seeded");

  // 5.4 Workflow HAR BOP
  await seedStandardWorkflow({
    bidang: harBopBidang,
    name: "Workflow TOR Bidang Pemeliharaan BOP",
    asmanPosition: asmanHarBop,
  });
  console.log("Workflow for HAR BOP seeded");

  // 5.5 Workflow K3
  await seedStandardWorkflow({
    bidang: k3Bidang,
    name: "Workflow TOR Bidang K3",
    asmanPosition: asmanK3,
  });
  console.log("Workflow for K3 seeded");

  // 5.6 Workflow HAR Instrumen
  await seedStandardWorkflow({
    bidang: harInsBidang,
    name: "Workflow TOR Bidang Pemeliharaan Instrumen",
    asmanPosition: asmanHarLis, // sesuai flow: Asman Listrik pegang Approval 1
  });
  console.log("Workflow for HAR Instrumen seeded");

  // 5.7 Workflow Umum
  const umumWorkflow = await prisma.workflow.upsert({
    where: { bidangId: umumBidang.id },
    update: {},
    create: {
      name: "Workflow TOR Bidang Umum",
      bidangId: umumBidang.id,
    },
  });

  // Asman Lim → MADM → MENG → Pengadaan
  await prisma.workflowStep.upsert({
    where: {
      workflowId_stepNumber: {
        workflowId: umumWorkflow.id,
        stepNumber: 1,
      },
    },
    update: {},
    create: {
      workflowId: umumWorkflow.id,
      stepNumber: 1,
      label: "Approval 1 (Asman Lim)",
      positionId: asmanLim.id,
      statusStage: "APPROVAL_1",
      canRevise: true,
      revisionTargetStep: 0,
    },
  });

  await prisma.workflowStep.upsert({
    where: {
      workflowId_stepNumber: {
        workflowId: umumWorkflow.id,
        stepNumber: 2,
      },
    },
    update: {},
    create: {
      workflowId: umumWorkflow.id,
      stepNumber: 2,
      label: "Approval 2 (Manager Administrasi)",
      positionId: madm.id,
      statusStage: "APPROVAL_2",
      canRevise: true,
      revisionTargetStep: 0,
    },
  });

  await prisma.workflowStep.upsert({
    where: {
      workflowId_stepNumber: {
        workflowId: umumWorkflow.id,
        stepNumber: 3,
      },
    },
    update: {},
    create: {
      workflowId: umumWorkflow.id,
      stepNumber: 3,
      label: "Approval 3 (Manager Enjiniring)",
      positionId: meng.id,
      statusStage: "APPROVAL_3",
      canRevise: true,
      revisionTargetStep: 0,
    },
  });

  await prisma.workflowStep.upsert({
    where: {
      workflowId_stepNumber: {
        workflowId: umumWorkflow.id,
        stepNumber: 4,
      },
    },
    update: {},
    create: {
      workflowId: umumWorkflow.id,
      stepNumber: 4,
      label: "Approval 4 (Pengadaan)",
      positionId: pengadaan.id,
      statusStage: "APPROVAL_4",
      canRevise: true,
      revisionTargetStep: 0,
      isLastStep: true,
    },
  });

  console.log("Workflow for Umum seeded");

  // 6. User Super Admin dan 1 contoh user Officer Outage (pakai bcrypt)
  const superAdminPassword = await bcrypt.hash("superadmin123", 10);
  const officerPassword = await bcrypt.hash("officer123", 10);

  const superAdminUser = await prisma.user.upsert({
    where: { email: "superadmin@tor.local" },
    update: {
      passwordHash: superAdminPassword,
      username: "admin",
    },
    create: {
      name: "Super Admin",
      username: "admin",
      email: "superadmin@tor.local",
      passwordHash: superAdminPassword,
      positionId: superAdminPosition.id,
      isSuperAdmin: true,
    },
  });

  const officerUser = await prisma.user.upsert({
    where: { email: "officer.outage@tor.local" },
    update: {
      passwordHash: officerPassword,
      username: "officer.outage",
    },
    create: {
      name: "Officer Outage Demo",
      username: "officer.outage",
      email: "officer.outage@tor.local",
      passwordHash: officerPassword,
      positionId: officerOutage.id,
      isSuperAdmin: false,
    },
  });

  // User #11 - Asman HAR Listrik
  const asmanHarLisPassword = await bcrypt.hash("asman123", 10);
  const user11 = await prisma.user.upsert({
    where: { email: "asman.harlis@tor.local" },
    update: {
      passwordHash: asmanHarLisPassword,
      username: "asman.harlis",
    },
    create: {
      name: "SYAHRIAL NURUL HUDA",
      username: "asman.harlis",
      email: "asman.harlis@tor.local",
      passwordHash: asmanHarLisPassword,
      positionId: asmanHarLis.id, // ID 15
      isSuperAdmin: false,
    },
  });

  // User #12 - Asman HAR Mekanik
  const asmanHarMecPassword = await bcrypt.hash("asman123", 10);
  const user12 = await prisma.user.upsert({
    where: { email: "asman.harmec@tor.local" },
    update: {
      passwordHash: asmanHarMecPassword,
      username: "asman.harmec",
    },
    create: {
      name: "YUNARKO",
      username: "asman.harmec",
      email: "asman.harmec@tor.local",
      passwordHash: asmanHarMecPassword,
      positionId: asmanHarMec.id, // ID 16
      isSuperAdmin: false,
    },
  });

  console.log("Users seeded:");
  console.log("  Super Admin:", superAdminUser.email, "| username:", superAdminUser.username);
  console.log("  Officer Outage:", officerUser.email, "| username:", officerUser.username);
  console.log("  User #11 (Asman HAR Listrik):", user11.email, "| username:", user11.username);
  console.log("  User #12 (Asman HAR Mekanik):", user12.email, "| username:", user12.username);

  // 7. Cross-Bidang Access untuk User #11 dan #12
  console.log("\n🌱 Seeding Cross-Bidang Access...");

  // User #11: Akses ke Bidang Pemeliharaan Listrik + Instrumen
  await prisma.positionBidangAccess.upsert({
    where: {
      positionId_bidangId: {
        positionId: asmanHarLis.id,
        bidangId: harLisBidang.id,
      },
    },
    create: {
      positionId: asmanHarLis.id,
      bidangId: harLisBidang.id,
    },
    update: {},
  });
  console.log(`  ✓ User #11 can access: ${harLisBidang.name}`);

  await prisma.positionBidangAccess.upsert({
    where: {
      positionId_bidangId: {
        positionId: asmanHarLis.id,
        bidangId: harInsBidang.id,
      },
    },
    create: {
      positionId: asmanHarLis.id,
      bidangId: harInsBidang.id,
    },
    update: {},
  });
  console.log(`  ✓ User #11 can access: ${harInsBidang.name}`);

  // User #12: Akses ke Bidang Pemeliharaan Mesin + BOP
  await prisma.positionBidangAccess.upsert({
    where: {
      positionId_bidangId: {
        positionId: asmanHarMec.id,
        bidangId: harMecBidang.id,
      },
    },
    create: {
      positionId: asmanHarMec.id,
      bidangId: harMecBidang.id,
    },
    update: {},
  });
  console.log(`  ✓ User #12 can access: ${harMecBidang.name}`);

  await prisma.positionBidangAccess.upsert({
    where: {
      positionId_bidangId: {
        positionId: asmanHarMec.id,
        bidangId: harBopBidang.id,
      },
    },
    create: {
      positionId: asmanHarMec.id,
      bidangId: harBopBidang.id,
    },
    update: {},
  });
  console.log(`  ✓ User #12 can access: ${harBopBidang.name}`);

  console.log("✅ Cross-Bidang Access seeded successfully!\n");

  console.log("Seeding done ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    prisma.$disconnect();
  });
