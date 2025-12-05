import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addTeamLeaderPosition() {
  console.log('➕ Adding TEAM LEADER PEMELIHARAAN MESIN position...\n');

  // Get Bidang Pemeliharaan Mesin
  const mesinBidang = await prisma.bidang.findFirst({
    where: {
      OR: [
        { name: { contains: 'Mesin', mode: 'insensitive' } },
        { name: { contains: 'Mekanik', mode: 'insensitive' } },
      ],
    },
  });

  if (!mesinBidang) {
    console.error('❌ Bidang Pemeliharaan Mesin not found!');
    return;
  }

  console.log(`Found Bidang: ${mesinBidang.name} (ID: ${mesinBidang.id})\n`);

  // Get CREATOR role
  const creatorRole = await prisma.role.findFirst({
    where: { name: 'CREATOR' },
  });

  if (!creatorRole) {
    console.error('❌ CREATOR role not found!');
    return;
  }

  console.log(`Found Role: ${creatorRole.name} (ID: ${creatorRole.id})\n`);

  // Create Position
  const position = await prisma.position.upsert({
    where: {
      id: 0, // Will not match, forces create
    },
    create: {
      name: 'TEAM LEADER PEMELIHARAAN MESIN UBP CLG',
      code: 'TL-MESIN',
      bidangId: mesinBidang.id,
      isGlobal: false,
      levelOrder: 100, // Adjust as needed
      isActive: true,
    },
    update: {},
  });

  console.log(`✅ Created Position: ${position.name} (ID: ${position.id})`);

  // Assign CREATOR role to this position
  const positionRole = await prisma.positionRole.upsert({
    where: {
      positionId_roleId: {
        positionId: position.id,
        roleId: creatorRole.id,
      },
    },
    create: {
      positionId: position.id,
      roleId: creatorRole.id,
    },
    update: {},
  });

  console.log(`✅ Assigned CREATOR role to position`);
  console.log(`\n🎉 Successfully added TEAM LEADER PEMELIHARAAN MESIN UBP CLG!`);
  console.log(`   - Position ID: ${position.id}`);
  console.log(`   - Bidang: ${mesinBidang.name}`);
  console.log(`   - Role: CREATOR`);
}

addTeamLeaderPosition()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
