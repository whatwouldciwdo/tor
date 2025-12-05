import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function assignEditorRole() {
  console.log('➕ Assigning EDITOR role to User #14 and #15...\n');

  // Get User #14 and #15
  const users = await prisma.user.findMany({
    where: {
      id: { in: [14, 15] },
    },
    include: {
      position: {
        include: {
          positionRoles: {
            include: {
              role: true,
            },
          },
        },
      },
    },
  });

  if (users.length === 0) {
    console.error('❌ User #14 or #15 not found!');
    return;
  }

  console.log('Found Users:');
  users.forEach(u => {
    console.log(`  - ID ${u.id}: ${u.name} (${u.position?.name})`);
    const roles = u.position?.positionRoles.map(pr => pr.role.name).join(', ') || 'None';
    console.log(`    Current Roles: ${roles}`);
  });
  console.log('');

  // Get EDITOR role
  const editorRole = await prisma.role.findFirst({
    where: { name: 'EDITOR' },
  });

  if (!editorRole) {
    console.error('❌ EDITOR role not found!');
    return;
  }

  console.log(`Found Role: ${editorRole.name} (ID: ${editorRole.id})\n`);

  // Assign EDITOR role to each user's position
  for (const user of users) {
    if (!user.positionId) {
      console.log(`⚠️  User #${user.id} has no position, skipping...`);
      continue;
    }

    // Check if already has EDITOR role
    const hasEditorRole = user.position?.positionRoles.some(
      pr => pr.role.name === 'EDITOR'
    );

    if (hasEditorRole) {
      console.log(`✓ User #${user.id} (${user.name}) already has EDITOR role`);
      continue;
    }

    // Assign EDITOR role
    await prisma.positionRole.upsert({
      where: {
        positionId_roleId: {
          positionId: user.positionId,
          roleId: editorRole.id,
        },
      },
      create: {
        positionId: user.positionId,
        roleId: editorRole.id,
      },
      update: {},
    });

    console.log(`✅ Assigned EDITOR role to User #${user.id} (${user.name})`);
    console.log(`   Position: ${user.position?.name}`);
  }

  console.log('\n🎉 Successfully assigned EDITOR role!');
}

assignEditorRole()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
