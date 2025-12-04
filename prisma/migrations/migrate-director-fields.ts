import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateDirectorFields() {
  console.log('🚀 Starting director fields migration...');

  // Get ALL TORs and filter in memory
  const allTors = await prisma.tor.findMany({
    select: {
      id: true,
      number: true,
      directorProposal: true,
      fieldDirectorProposal: true,
      directorProposals: true,
      fieldDirectorProposals: true,
    }
  });

  // Filter TORs that need migration
  const tors = allTors.filter(tor => 
    (tor.directorProposal && !tor.directorProposals) ||
    (tor.fieldDirectorProposal && !tor.fieldDirectorProposals)
  );

  console.log(`📋 Found ${tors.length} TORs to migrate (from ${allTors.length} total)`);

  let migratedCount = 0;

  for (const tor of tors) {
    const updates: any = {};
    let needsUpdate = false;

    // Migrate directorProposal (String) -> directorProposals (Json[])
    if (tor.directorProposal && !tor.directorProposals) {
      updates.directorProposals = [
        {
          id: '1',
          name: tor.directorProposal
        }
      ];
      needsUpdate = true;
      console.log(`  ✓ Migrating directorProposal for TOR #${tor.id} (${tor.number})`);
    }

    // Migrate fieldDirectorProposal (String/Json) -> fieldDirectorProposals (Json[])
    if (tor.fieldDirectorProposal && !tor.fieldDirectorProposals) {
      const oldValue = tor.fieldDirectorProposal;
      
      if (typeof oldValue === 'string') {
        // Old format: single string
        updates.fieldDirectorProposals = [
          {
            id: '1',
            name: oldValue
          }
        ];
      } else if (Array.isArray(oldValue)) {
        // Already in array format (edge case)
        updates.fieldDirectorProposals = oldValue.map((item: any, index: number) => ({
          id: item.id || `${index + 1}`,
          name: typeof item === 'string' ? item : item.name || ''
        }));
      } else if (oldValue && typeof oldValue === 'object') {
        // Single object format
        const obj = oldValue as any;
        updates.fieldDirectorProposals = [
          {
            id: obj.id || '1',
            name: obj.name || ''
          }
        ];
      } else {
        // Unknown format, create empty array
        updates.fieldDirectorProposals = [];
      }
      
      needsUpdate = true;
      console.log(`  ✓ Migrating fieldDirectorProposal for TOR #${tor.id} (${tor.number})`);
    }

    if (needsUpdate) {
      try {
        await prisma.tor.update({
          where: { id: tor.id },
          data: updates
        });
        migratedCount++;
        console.log(`  ✅ Successfully migrated TOR #${tor.id}`);
      } catch (error) {
        console.error(`  ❌ Failed to migrate TOR #${tor.id}:`, error);
      }
    } else {
      console.log(`  ⏭️  TOR #${tor.id} already migrated`);
    }
  }

  console.log(`\n✅ Migration complete: ${migratedCount}/${tors.length} TORs migrated`);
}

migrateDirectorFields()
  .then(() => {
    console.log('✅ All done!');
    process.exit(0);
  })
  .catch((e) => {
    console.error('❌ Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });