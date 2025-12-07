import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyMesinWorkflow() {
  console.log('🔍 Verifying Bidang Pemeliharaan Mesin Workflow...\n');

  // Get Bidang Pemeliharaan Mesin
  const mesin = await prisma.bidang.findFirst({
    where: {
      OR: [
        { name: { contains: 'Mesin', mode: 'insensitive' } },
        { name: { contains: 'Mekanik', mode: 'insensitive' } },
      ]
    },
    include: {
      workflows: {
        include: {
          steps: {
            orderBy: {
              stepNumber: 'asc'
            },
            include: {
              position: true
            }
          }
        }
      },
      positions: {
        include: {
          positionRoles: {
            include: {
              role: true
            }
          }
        }
      }
    }
  });

  if (!mesin) {
    console.log('❌ Bidang Pemeliharaan Mesin not found!');
    return;
  }

  console.log('✅ Bidang Pemeliharaan Mesin:');
  console.log(`   Code: ${mesin.code}`);
  console.log(`   Name: ${mesin.name}\n`);

  // Show creator positions
  console.log('📝 Creator Positions (dapat membuat TOR):');
  const creators = mesin.positions.filter(p => 
    p.positionRoles.some(pr => pr.role.name === 'CREATOR')
  );

  creators.forEach((p, index) => {
    const roles = p.positionRoles.map(pr => pr.role.name).join(', ');
    console.log(`   ${index + 1}. ${p.name}`);
    console.log(`      Roles: ${roles}`);
  });

  console.log('');

  // Show workflow
  const workflow = mesin.workflows?.[0];
  if (workflow) {
    console.log('🔄 Approval Workflow Steps:');
    workflow.steps.forEach(step => {
      console.log(`   ${step.stepNumber}. ${step.label}`);
      console.log(`      Position: ${step.position.name}`);
      console.log(`      Status Stage: ${step.statusStage}`);
      console.log(`      Can Revise: ${step.canRevise ? '✅ Yes' : '❌ No'}`);
      if (step.isLastStep) {
        console.log(`      🏁 FINAL APPROVAL STEP`);
      }
      console.log('');
    });
  } else {
    console.log('❌ No workflow found!');
  }

  console.log('✅ Verification complete!');
}

verifyMesinWorkflow()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
