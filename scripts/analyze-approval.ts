import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function analyzeApprovalFlow() {
  console.log('='.repeat(60));
  console.log('📊 ANALISIS WORKFLOW & APPROVAL FLOW');
  console.log('='.repeat(60));
  console.log('');

  // 1. Check TOR 8
  console.log('1️⃣ STATUS TOR ID 8:');
  console.log('-'.repeat(60));
  const tor = await prisma.tor.findUnique({
    where: { id: 8 },
    include: {
      bidang: true,
      creator: {
        include: { position: true }
      }
    }
  });

  if (!tor) {
    console.log('❌ TOR ID 8 tidak ditemukan!');
    await prisma.$disconnect();
    return;
  }

  console.log(`   TOR: ${tor.title || 'No Title'}`);
  console.log(`   Bidang: ${tor.bidang.name} (ID: ${tor.bidangId})`);
  console.log(`   Creator: ${tor.creator.name} (Position: ${tor.creator.position?.name})`);
  console.log(`   Current Step: ${tor.currentStepNumber}`);
  console.log(`   Status Stage: ${tor.statusStage}`);
  console.log(`   Final Approved: ${tor.isFinalApproved}`);
  console.log('');

  // 2. Check Workflow for this Bidang
  console.log('2️⃣ WORKFLOW CONFIGURATION:');
  console.log('-'.repeat(60));
  const workflow = await prisma.workflow.findUnique({
    where: { bidangId: tor.bidangId },
    include: {
      steps: {
        orderBy: { stepNumber: 'asc' },
        include: {
          position: true
        }
      }
    }
  });

  if (!workflow) {
    console.log(`❌ Workflow tidak ditemukan untuk Bidang ${tor.bidang.name}!`);
    console.log('   📝 Solusi: Buat workflow untuk bidang ini di database');
    await prisma.$disconnect();
    return;
  }

  console.log(`   Workflow: ${workflow.name} (ID: ${workflow.id})`);
  console.log(`   Total Steps: ${workflow.steps.length}`);
  console.log('');

  console.log('   Steps:');
  workflow.steps.forEach(step => {
    const isCurrent = step.stepNumber === tor.currentStepNumber;
    const marker = isCurrent ? '👉' : '  ';
    console.log(`   ${marker} Step ${step.stepNumber}: ${step.label}`);
    console.log(`      Status: ${step.statusStage}`);
    console.log(`      Position: ${step.position.name} (ID: ${step.positionId})`);
    console.log(`      Can Revise: ${step.canRevise}`);
    console.log(`      Is Last Step: ${step.isLastStep}`);
    if (isCurrent) {
      console.log(`      ⚠️  CURRENT STEP - Need approval from position: ${step.position.name}`);
    }
    console.log('');
  });

  // 3. Check Users who can approve current step
  console.log('3️⃣ APPROVERS FOR CURRENT STEP:');
  console.log('-'.repeat(60));
  const currentStep = workflow.steps.find(s => s.stepNumber === tor.currentStepNumber);
  
  if (!currentStep) {
    console.log('❌ Current step tidak ditemukan di workflow!');
    console.log(`   Current step number: ${tor.currentStepNumber}`);
    console.log(`   Available steps: ${workflow.steps.map(s => s.stepNumber).join(', ')}`);
    await prisma.$disconnect();
    return;
  }

  const approvers = await prisma.user.findMany({
    where: {
      OR: [
        { positionId: currentStep.positionId },
        { isSuperAdmin: true }
      ],
      isActive: true
    },
    include: {
      position: true
    }
  });

  if (approvers.length === 0) {
    console.log('❌ TIDAK ADA USER yang bisa approve step ini!');
    console.log(`   Required Position: ${currentStep.position.name} (ID: ${currentStep.positionId})`);
    console.log('');
    console.log('   📝 Solusi:');
    console.log('      1. Buat user baru dengan position ini');
    console.log('      2. ATAU update position dari user yang ada');
    console.log('      3. ATAU login sebagai super admin');
  } else {
    console.log(`✅ ${approvers.length} user bisa approve step ini:`);
    approvers.forEach(user => {
      const badge = user.isSuperAdmin ? '👑 Super Admin' : `📍 ${user.position?.name}`;
      console.log(`   • ${user.name} (${user.email}) - ${badge}`);
    });
  }
  console.log('');

  // 4. Check Approval History
  console.log('4️⃣ APPROVAL HISTORY:');
  console.log('-'.repeat(60));
  const history = await prisma.torApprovalHistory.findMany({
    where: { torId: 8 },
    orderBy: { createdAt: 'asc' },
    include: {
      actedBy: {
        include: { position: true }
      }
    }
  });

  if (history.length === 0) {
    console.log('   Tidak ada history approval');
  } else {
    history.forEach((h, index) => {
      console.log(`   ${index + 1}. ${h.action} (${h.fromStatusStage || 'START'} → ${h.toStatusStage})`);
      console.log(`      By: ${h.actedByNameSnapshot} (${h.actedByPositionSnapshot})`);
      console.log(`      Date: ${h.createdAt.toLocaleString('id-ID')}`);
      if (h.note) console.log(`      Note: ${h.note}`);
      console.log('');
    });
  }

  // 5. All Users (for reference)
  console.log('5️⃣ ALL USERS IN SYSTEM:');
  console.log('-'.repeat(60));
  const allUsers = await prisma.user.findMany({
    include: { position: true },
    orderBy: { id: 'asc' }
  });

  allUsers.forEach(user => {
    const badges = [];
    if (user.isSuperAdmin) badges.push('👑 Super Admin');
    if (!user.isActive) badges.push('❌ Inactive');
    const badgeStr = badges.length > 0 ? ` [${badges.join(', ')}]` : '';
    
    console.log(`   User ${user.id}: ${user.name}`);
    console.log(`      Email: ${user.email}`);
    console.log(`      Position: ${user.position?.name || 'No Position'} (ID: ${user.positionId})${badgeStr}`);
    console.log('');
  });

  console.log('='.repeat(60));
  console.log('✅ Analisis Selesai');
  console.log('='.repeat(60));

  await prisma.$disconnect();
}

analyzeApprovalFlow().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
