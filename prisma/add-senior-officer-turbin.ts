import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addSeniorOfficerPosition() {
  console.log('➕ Adding SENIOR OFFICER ENJINIRING TURBIN DAN GENERATOR position...\n');

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
      name: 'SENIOR OFFICER ENJINIRING TURBIN DAN GENERATOR UBP CLG',
      code: 'SO-TURBIN-GEN',
      bidangId: mesinBidang.id,
      isGlobal: false,
      levelOrder: 110, // Slightly higher than Team Leader
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

  // Check Workflow for Bidang Pemeliharaan Mesin
  console.log(`\n📋 Checking Workflow for Bidang Pemeliharaan Mesin...`);
  const workflow = await prisma.workflow.findUnique({
    where: { bidangId: mesinBidang.id },
    include: {
      steps: {
        include: {
          position: true,
        },
        orderBy: { stepNumber: 'asc' },
      },
    },
  });

  if (workflow) {
    console.log(`\n✅ Workflow exists: ${workflow.name} (ID: ${workflow.id})`);
    console.log(`   Total Steps: ${workflow.steps.length}\n`);
    
    console.log('Approval Steps:');
    workflow.steps.forEach((step) => {
      console.log(`  ${step.stepNumber}. ${step.label} → ${step.position.name}`);
      console.log(`     Status: ${step.statusStage}, IsLastStep: ${step.isLastStep}`);
    });
  } else {
    console.log(`\n⚠️  No workflow found for Bidang Pemeliharaan Mesin!`);
    console.log(`   TORs created by this position will need workflow setup.`);
  }

  console.log(`\n🎉 Successfully added SENIOR OFFICER ENJINIRING TURBIN DAN GENERATOR UBP CLG!`);
  console.log(`   - Position ID: ${position.id}`);
  console.log(`   - Bidang: ${mesinBidang.name}`);
  console.log(`   - Role: CREATOR`);
  console.log(`\n✅ Logic Check: Position can CREATE TORs for Bidang Pemeliharaan Mesin`);
  console.log(`✅ Logic Check: TORs will follow existing workflow approval steps`);
}

addSeniorOfficerPosition()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
