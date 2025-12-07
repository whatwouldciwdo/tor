import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyBopWorkflow() {
  console.log('🔍 Verifying Bidang Pemeliharaan BOP Workflow...\n');

  // Get Bidang Pemeliharaan BOP
  const bop = await prisma.bidang.findFirst({
    where: {
      OR: [
        { code: 'HAR_BOP' },
        { name: { contains: 'BOP', mode: 'insensitive' } },
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

  if (!bop) {
    console.log('❌ Bidang Pemeliharaan BOP not found!');
    return;
  }

  console.log('✅ Bidang Pemeliharaan BOP:');
  console.log(`   Code: ${bop.code}`);
  console.log(`   Name: ${bop.name}\n`);

  // Show creator positions
  console.log('📝 Creator Positions (dapat membuat TOR):');
  const creators = bop.positions.filter(p => 
    p.positionRoles.some(pr => pr.role.name === 'CREATOR')
  );

  creators.forEach((p, index) => {
    const roles = p.positionRoles.map(pr => pr.role.name).join(', ');
    console.log(`   ${index + 1}. ${p.name}`);
    console.log(`      Roles: ${roles}`);
  });

  console.log('');

  // Show workflow
  const workflow = bop.workflows?.[0];
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

verifyBopWorkflow()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
