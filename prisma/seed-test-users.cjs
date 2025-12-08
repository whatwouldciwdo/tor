// prisma/seed-test-users.cjs
// Seed dedicated test users for load testing
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🧪 Seeding test users for load testing...\n");

  // Get all bidang
  const bidangOutage = await prisma.bidang.findFirst({ where: { code: "OUTAGE" } });
  const bidangHarLis = await prisma.bidang.findFirst({ where: { code: "HAR_LIS" } });
  const bidangHarMec = await prisma.bidang.findFirst({ where: { code: "HAR_MEC" } });
  const bidangHarBop = await prisma.bidang.findFirst({ where: { code: "HAR_BOP" } });
  const bidangK3 = await prisma.bidang.findFirst({ where: { code: "K3" } });
  const bidangUmum = await prisma.bidang.findFirst({ where: { code: "UMUM" } });
  const bidangHarIns = await prisma.bidang.findFirst({ where: { code: "HAR_INC" } });

  // Get CREATOR and EDITOR roles
  const creatorRole = await prisma.role.findFirst({ where: { name: "CREATOR" } });
  const editorRole = await prisma.role.findFirst({ where: { name: "EDITOR" } });

  if (!creatorRole || !editorRole) {
    console.error("❌ CREATOR or EDITOR role not found. Please run main seed first.");
    process.exit(1);
  }

  // Test users configuration with their bidang
  const testUsersConfig = [
    { username: "testuser1", bidang: bidangOutage, bidangName: "Outage" },
    { username: "testuser2", bidang: bidangHarLis, bidangName: "HAR Listrik" },
    { username: "testuser3", bidang: bidangHarMec, bidangName: "HAR Mekanik" },
    { username: "testuser4", bidang: bidangHarBop, bidangName: "HAR BOP" },
    { username: "testuser5", bidang: bidangK3, bidangName: "K3" },
    { username: "testuser6", bidang: bidangUmum, bidangName: "Umum" },
    { username: "testuser7", bidang: bidangHarIns, bidangName: "HAR Instrumen" },
    { username: "testuser8", bidang: bidangOutage, bidangName: "Outage" },
    { username: "testuser9", bidang: bidangHarLis, bidangName: "HAR Listrik" },
    { username: "testuser10", bidang: bidangHarMec, bidangName: "HAR Mekanik" },
  ];

  const hashedPassword = await bcrypt.hash("test123", 10);
  
  for (const config of testUsersConfig) {
    if (!config.bidang) {
      console.log(`⚠️  Skipping ${config.username} - bidang ${config.bidangName} not found`);
      continue;
    }

    // Create or update test position
    const positionName = `Test Position - ${config.username}`;
    const position = await prisma.position.upsert({
      where: { 
        id: 0, // This will always create new since id 0 doesn't exist
      },
      update: {},
      create: {
        name: positionName,
        code: `TEST_${config.username.toUpperCase()}`,
        bidangId: config.bidang.id,
        levelOrder: 1,
        isActive: true,
      },
    });

    // Assign CREATOR and EDITOR roles to this position
    await prisma.positionRole.upsert({
      where: {
        positionId_roleId: {
          positionId: position.id,
          roleId: creatorRole.id,
        },
      },
      update: {},
      create: {
        positionId: position.id,
        roleId: creatorRole.id,
      },
    });

    await prisma.positionRole.upsert({
      where: {
        positionId_roleId: {
          positionId: position.id,
          roleId: editorRole.id,
        },
      },
      update: {},
      create: {
        positionId: position.id,
        roleId: editorRole.id,
      },
    });

    // Create or update test user
    const email = `${config.username}@loadtest.local`;
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        passwordHash: hashedPassword,
        username: config.username,
        positionId: position.id,
      },
      create: {
        name: `Test User ${config.username.replace('testuser', '')} - ${config.bidangName}`,
        username: config.username,
        email: email,
        passwordHash: hashedPassword,
        positionId: position.id,
        isSuperAdmin: false,
      },
    });

    console.log(`✅ Created: ${user.username} (${config.bidangName})`);
  }

  console.log("\n🎉 Test users seeded successfully!");
  console.log("\n📋 Test Credentials:");
  console.log("   Username: testuser1 - testuser10");
  console.log("   Password: test123");
  console.log("\n💡 Run load test:");
  console.log("   npm run test:load");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding test users:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
