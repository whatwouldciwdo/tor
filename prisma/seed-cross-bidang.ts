import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCrossBidangAccess() {
  console.log('🌱 Seeding Cross-Bidang Access...\n');

  // Get User #11 and #12
  const user11 = await prisma.user.findUnique({
    where: { id: 11 },
    include: { position: true },
  });

  const user12 = await prisma.user.findUnique({
    where: { id: 12 },
    include: { position: true },
  });

  if (!user11 || !user12) {
    console.error('❌ User #11 or #12 not found!');
    return;
  }

  console.log('User #11:', user11.name, '- Position:', user11.position?.name);
  console.log('User #12:', user12.name, '- Position:', user12.position?.name);
  console.log('');

  // Get bidangs
  const bidangs = await prisma.bidang.findMany({
    select: { id: true, name: true },
  });

  console.log('Available Bidangs:');
  bidangs.forEach(b => console.log(`  ${b.id}: ${b.name}`));
  console.log('');

  // Find Bidangs for User #11 (Pemeliharaan Listrik + Instrument)
  const listrikBidang = bidangs.find(b => 
    b.name.toLowerCase().includes('listrik') || b.name.toLowerCase().includes('elektrik')
  );
  const instrumentBidang = bidangs.find(b => 
    b.name.toLowerCase().includes('instrument') || b.name.toLowerCase().includes('instrumen')
  );

  // Find Bidangs for User #12 (Pemeliharaan Mekanik + BOP)
  const mekanikBidang = bidangs.find(b => 
    b.name.toLowerCase().includes('mekanik') || b.name.toLowerCase().includes('mesin')
  );
  const bopBidang = bidangs.find(b => 
    b.name.toLowerCase().includes('bop')
  );

  console.log('Identified Bidangs:');
  console.log(`  Listrik: ${listrikBidang?.id} - ${listrikBidang?.name}`);
  console.log(`  Instrument: ${instrumentBidang?.id} - ${instrumentBidang?.name}`);
  console.log(`  Mekanik: ${mekanikBidang?.id} - ${mekanikBidang?.name}`);
  console.log(`  BOP: ${bopBidang?.id} - ${bopBidang?.name}`);
  console.log('');

  // Seed User #11 access
  if (user11.positionId && listrikBidang && instrumentBidang) {
    console.log(`Adding access for User #11 (${user11.name}):`);
    
    const access1 = await prisma.positionBidangAccess.upsert({
      where: {
        positionId_bidangId: {
          positionId: user11.positionId,
          bidangId: listrikBidang.id,
        },
      },
      create: {
        positionId: user11.positionId,
        bidangId: listrikBidang.id,
      },
      update: {},
    });
    console.log(`  ✓ ${listrikBidang.name}`);

    const access2 = await prisma.positionBidangAccess.upsert({
      where: {
        positionId_bidangId: {
          positionId: user11.positionId,
          bidangId: instrumentBidang.id,
        },
      },
      create: {
        positionId: user11.positionId,
        bidangId: instrumentBidang.id,
      },
      update: {},
    });
    console.log(`  ✓ ${instrumentBidang.name}`);
  }

  console.log('');

  // Seed User #12 access
  if (user12.positionId && mekanikBidang && bopBidang) {
    console.log(`Adding access for User #12 (${user12.name}):`);
    
    const access1 = await prisma.positionBidangAccess.upsert({
      where: {
        positionId_bidangId: {
          positionId: user12.positionId,
          bidangId: mekanikBidang.id,
        },
      },
      create: {
        positionId: user12.positionId,
        bidangId: mekanikBidang.id,
      },
      update: {},
    });
    console.log(`  ✓ ${mekanikBidang.name}`);

    const access2 = await prisma.positionBidangAccess.upsert({
      where: {
        positionId_bidangId: {
          positionId: user12.positionId,
          bidangId: bopBidang.id,
        },
      },
      create: {
        positionId: user12.positionId,
        bidangId: bopBidang.id,
      },
      update: {},
    });
    console.log(`  ✓ ${bopBidang.name}`);
  }

  console.log('\n✅ Cross-Bidang Access seeded successfully!');
}

seedCrossBidangAccess()
  .catch((e) => {
    console.error('Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
