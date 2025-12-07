import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyPositions() {
  console.log('🔍 Verifying position assignments...\n');

  // Check BOILER in Outage
  const boilerOutage = await prisma.position.findFirst({
    where: {
      name: "SENIOR OFFICER ENJINIRING BOILER DAN HRSG UBP CLG",
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

  if (boilerOutage) {
    console.log('✅ BOILER Position:');
    console.log(`   ID: ${boilerOutage.id}`);
    console.log(`   Bidang: ${boilerOutage.bidang?.name}`);
    console.log(`   Roles: ${boilerOutage.positionRoles.map(pr => pr.role.name).join(', ')}`);
  } else {
    console.log('❌ BOILER position not found!');
  }

  console.log('');

  // Check TURBIN in Mesin
  const turbineMesin = await prisma.position.findFirst({
    where: {
      name: "SENIOR OFFICER ENJINIRING TURBIN DAN GENERATOR UBP CLG",
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

  if (turbineMesin) {
    console.log('✅ TURBIN Position:');
    console.log(`   ID: ${turbineMesin.id}`);
    console.log(`   Bidang: ${turbineMesin.bidang?.name}`);
    console.log(`   Roles: ${turbineMesin.positionRoles.map(pr => pr.role.name).join(', ')}`);
  } else {
    console.log('❌ TURBIN position not found!');
  }

  console.log('\n✅ Verification complete!');
}

verifyPositions()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
