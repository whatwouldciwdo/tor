// prisma/cleanup-test-users.cjs
// Delete test users and associated data created for load testing
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Cleaning up test users and associated data...\n");

  // Find all test users
  const testUsers = await prisma.user.findMany({
    where: {
      username: {
        in: [
          "testuser1", "testuser2", "testuser3", "testuser4", "testuser5",
          "testuser6", "testuser7", "testuser8", "testuser9", "testuser10"
        ]
      }
    },
    include: {
      position: true
    }
  });

  if (testUsers.length === 0) {
    console.log("✅ No test users found. Already cleaned up!");
    return;
  }

  console.log(`📋 Found ${testUsers.length} test users to delete\n`);

  const userIds = testUsers.map(u => u.id);
  const positionIds = [...new Set(testUsers.map(u => u.positionId).filter(Boolean))];

  // Delete TORs created by test users (approval history will be cascade deleted)
  const deletedTors = await prisma.tor.deleteMany({
    where: {
      creatorUserId: { in: userIds }
    }
  });
  console.log(`🗑️  Deleted ${deletedTors.count} TORs created by test users`);


  // Delete test users
  const deletedUsers = await prisma.user.deleteMany({
    where: {
      id: { in: userIds }
    }
  });
  console.log(`🗑️  Deleted ${deletedUsers.count} test users`);

  // Delete position role assignments for test positions
  if (positionIds.length > 0) {
    const deletedPosRoles = await prisma.positionRole.deleteMany({
      where: {
        positionId: { in: positionIds }
      }
    });
    console.log(`🗑️  Deleted ${deletedPosRoles.count} position role assignments`);

    // Delete test positions
    const deletedPositions = await prisma.position.deleteMany({
      where: {
        id: { in: positionIds },
        code: { startsWith: "TEST_" }
      }
    });
    console.log(`🗑️  Deleted ${deletedPositions.count} test positions`);
  }

  console.log("\n🎉 Cleanup completed successfully!");
  console.log(`\n📊 Summary:`);
  console.log(`   - Test users deleted: ${deletedUsers.count}`);
  console.log(`   - TORs deleted: ${deletedTors.count}`);
  console.log(`   - Positions deleted: ${positionIds.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Error cleaning up test users:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
