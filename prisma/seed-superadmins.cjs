// prisma/seed-superadmins.cjs
// Create superadmin users with full access
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("👑 Creating superadmin users...\n");

  // Get all roles
  const allRoles = await prisma.role.findMany();
  if (allRoles.length === 0) {
    console.error("❌ No roles found. Please run main seed first.");
    process.exit(1);
  }

  // Get all bidang
  const allBidang = await prisma.bidang.findMany();
  if (allBidang.length === 0) {
    console.error("❌ No bidang found. Please run main seed first.");
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash("super.lim123", 10);

  const superadmins = [
    { username: "super.lim01", name: "Super Admin 1" },
    { username: "super.lim02", name: "Super Admin 2" },
  ];

  for (const admin of superadmins) {
    // Create superadmin position with access to all bidang
    const position = await prisma.position.upsert({
      where: { 
        id: 0, // This will always create new since id 0 doesn't exist
      },
      update: {},
      create: {
        name: `Superadmin Position - ${admin.username}`,
        code: `SUPER_${admin.username.toUpperCase().replace('.', '_')}`,
        isGlobal: true, // Global position
        levelOrder: 999, // Highest level
        isActive: true,
      },
    });

    // Assign ALL roles to this position
    for (const role of allRoles) {
      await prisma.positionRole.upsert({
        where: {
          positionId_roleId: {
            positionId: position.id,
            roleId: role.id,
          },
        },
        update: {},
        create: {
          positionId: position.id,
          roleId: role.id,
        },
      });
    }

    // Grant access to ALL bidang
    for (const bidang of allBidang) {
      await prisma.positionBidangAccess.upsert({
        where: {
          positionId_bidangId: {
            positionId: position.id,
            bidangId: bidang.id,
          },
        },
        update: {},
        create: {
          positionId: position.id,
          bidangId: bidang.id,
        },
      });
    }

    // Create superadmin user
    const email = `${admin.username}@limraya.com`;
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        passwordHash: hashedPassword,
        username: admin.username,
        positionId: position.id,
        isSuperAdmin: true,
      },
      create: {
        name: admin.name,
        username: admin.username,
        email: email,
        passwordHash: hashedPassword,
        positionId: position.id,
        isSuperAdmin: true,
      },
    });

    console.log(`✅ Created: ${user.username} (Superadmin)`);
    console.log(`   - Position: ${position.name}`);
    console.log(`   - Roles assigned: ${allRoles.length} (ALL)`);
    console.log(`   - Bidang access: ${allBidang.length} (ALL)\n`);
  }

  console.log("🎉 Superadmin users created successfully!\n");
  console.log("📋 Superadmin Credentials:");
  console.log("   Username: super.lim01, super.lim02");
  console.log("   Password: super.lim123");
  console.log("\n💡 These users have:");
  console.log("   ✓ Full access to ALL bidang");
  console.log("   ✓ ALL roles (CREATOR, EDITOR, APPROVER, ADMIN)");
  console.log("   ✓ Can create, edit, approve, submit, revise all TORs");
}

main()
  .catch((e) => {
    console.error("❌ Error creating superadmin users:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
