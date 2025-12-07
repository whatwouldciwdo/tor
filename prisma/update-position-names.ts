import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updatePositionNames() {
  console.log('🔄 Updating position names...\n');

  try {
    // Update TURBIN position yang ada di Outage menjadi BOILER
    const turbineOutage = await prisma.position.findFirst({
      where: {
        name: "SENIOR OFFICER ENJINIRING TURBIN DAN GENERATOR UBP CLG",
        bidang: {
          code: "OUTAGE"
        }
      },
      include: { bidang: true }
    });

    if (turbineOutage) {
      console.log('Found TURBIN position in Outage:', turbineOutage.id);
      
      const updated = await prisma.position.update({
        where: { id: turbineOutage.id },
        data: {
          name: "SENIOR OFFICER ENJINIRING BOILER DAN HRSG CLG PGU"
        }
      });
      
      console.log('✅ Updated to BOILER:', updated.name);
    }

    // Check if TURBIN exists in Mesin
    const turbineMesin = await prisma.position.findFirst({
      where: {
        name: "SENIOR OFFICER ENJINIRING TURBIN DAN GENERATOR UBP CLG",
        bidang: {
          code: "HAR_MEC"
        }
      },
      include: { bidang: true }
    });

    if (turbineMesin) {
      console.log('✅ TURBIN position already exists in Mesin:', turbineMesin.id);
    } else {
      console.log('⚠️  TURBIN position not found in Mesin - will be created by seed');
    }

    console.log('\n✅ Position names updated successfully!');
  } catch (error) {
    console.error('❌ Error updating positions:', error);
    throw error;
  }
}

updatePositionNames()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
