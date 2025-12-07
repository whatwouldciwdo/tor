import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyOutageWorkflow() {
  console.log('🔍 Verifying Bidang Outage Workflow...\n');

  // Get Bidang Outage
  const outage = await prisma.bidang.findUnique({
    where: { code: 'OUTAGE' },
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

  if (!outage) {
    console.log('❌ Bidang Outage not found!');
    return;
  }

  console.log('✅ Bidang Outage:');
  console.log(`   Code: ${outage.code}`);
  console.log(`   Name: ${outage.name}\n`);

  // Show creator positions
  console.log('📝 Creator Positions:');
  const creators = outage.positions.filter(p => 
    p.positionRoles.some(pr => pr.role.name === 'CREATOR')
  );

  creators.forEach(p => {
    const roles = p.positionRoles.map(pr => pr.role.name).join(', ');
    console.log(`   - ${p.name}`);
    console.log(`     Roles: ${roles}`);
  });

  console.log('');

  // Show workflow
  const workflow = outage.workflows?.[0];
  if (workflow) {
    console.log('🔄 Workflow Steps:');
    workflow.steps.forEach(step => {
      console.log(`   ${step.stepNumber}. ${step.label}`);
      console.log(`      Position: ${step.position.name}`);
      console.log(`      Status: ${step.statusStage}`);
      console.log(`      Can Revise: ${step.canRevise}`);
      if (step.isLastStep) {
        console.log(`      🏁 FINAL STEP`);
      }
      console.log('');
    });
  } else {
    console.log('❌ No workflow found!');
  }

  console.log('✅ Verification complete!');
}

verifyOutageWorkflow()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
