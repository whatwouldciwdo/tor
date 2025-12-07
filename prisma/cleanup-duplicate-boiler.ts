import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupDuplicateBoiler() {
  console.log('🧹 Cleaning up duplicate BOILER positions...\n');

  // Find all BOILER positions
  const boilerPositions = await prisma.position.findMany({
    where: {
      name: {
        contains: 'BOILER'
      }
    },
    include: {
      bidang: true,
      positionRoles: {
        include: {
          role: true
        }
      }
    }
  });

  console.log('Found BOILER positions:');
  boilerPositions.forEach(p => {
    console.log(`  ID ${p.id}: ${p.name} (${p.bidang?.name})`);
  });
  console.log('');

  // Keep only ID #2: SENIOR OFFICER ENJINIRING BOILER DAN HRSG UBP CLG
  const correctPosition = boilerPositions.find(p => 
    p.name === "SENIOR OFFICER ENJINIRING BOILER DAN HRSG UBP CLG"
  );

  if (!correctPosition) {
    console.log('❌ Correct position not found! Creating it...');
    
    const outage = await prisma.bidang.findUnique({
      where: { code: 'OUTAGE' }
    });

    if (!outage) {
      throw new Error('Outage bidang not found!');
    }

    const created = await prisma.position.create({
      data: {
        name: "SENIOR OFFICER ENJINIRING BOILER DAN HRSG UBP CLG",
        bidangId: outage.id,
        levelOrder: 1,
        isActive: true
      }
    });

    console.log(`✅ Created correct position: ID ${created.id}`);
    
    // Add CREATOR and EDITOR roles
    const creatorRole = await prisma.role.findUnique({ where: { name: 'CREATOR' } });
    const editorRole = await prisma.role.findUnique({ where: { name: 'EDITOR' } });

    if (creatorRole) {
      await prisma.positionRole.upsert({
        where: {
          positionId_roleId: {
            positionId: created.id,
            roleId: creatorRole.id
          }
        },
        create: {
          positionId: created.id,
          roleId: creatorRole.id
        },
        update: {}
      });
    }

    if (editorRole) {
      await prisma.positionRole.upsert({
        where: {
          positionId_roleId: {
            positionId: created.id,
            roleId: editorRole.id
          }
        },
        create: {
          positionId: created.id,
          roleId: editorRole.id
        },
        update: {}
      });
    }
  } else {
    console.log(`✅ Correct position exists: ID ${correctPosition.id}`);
  }

  // Delete duplicates (positions with "CLG PGU" suffix)
  const duplicates = boilerPositions.filter(p => 
    p.name.includes('CLG PGU') || p.name !== "SENIOR OFFICER ENJINIRING BOILER DAN HRSG UBP CLG"
  );

  for (const dup of duplicates) {
    console.log(`🗑️  Deleting duplicate: ID ${dup.id} - ${dup.name}`);
    
    // Delete related records first
    await prisma.positionRole.deleteMany({
      where: { positionId: dup.id }
    });

    await prisma.positionBidangAccess.deleteMany({
      where: { positionId: dup.id }
    });

    // Check if any users have this position
    const usersWithPosition = await prisma.user.count({
      where: { positionId: dup.id }
    });

    if (usersWithPosition > 0) {
      console.log(`   ⚠️  Position has ${usersWithPosition} user(s), updating them...`);
      // Update users to use the correct position
      if (correctPosition) {
        await prisma.user.updateMany({
          where: { positionId: dup.id },
          data: { positionId: correctPosition.id }
        });
      }
    }

    // Delete the position
    await prisma.position.delete({
      where: { id: dup.id }
    });

    console.log(`   ✅ Deleted`);
  }

  console.log('\n✅ Cleanup complete!');
}

cleanupDuplicateBoiler()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
