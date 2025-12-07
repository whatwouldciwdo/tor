import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkMigrationStatus() {
  console.log('🔍 Checking director fields migration status...\n');

  // Get ALL TORs
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

  console.log(`📋 Total TORs in database: ${allTors.length}\n`);

  if (allTors.length === 0) {
    console.log('ℹ️  No TORs found in database. Migration not needed.');
    return;
  }

  // Check which TORs need migration
  const needsMigration = allTors.filter(tor => 
    (tor.directorProposal && !tor.directorProposals) ||
    (tor.fieldDirectorProposal && !tor.fieldDirectorProposals)
  );

  const alreadyMigrated = allTors.filter(tor => 
    tor.directorProposals || tor.fieldDirectorProposals
  );

  console.log('📊 Migration Status:\n');
  console.log(`  ✅ Already migrated: ${alreadyMigrated.length} TORs`);
  console.log(`  ⏳ Needs migration: ${needsMigration.length} TORs`);
  console.log(`  ℹ️  No data: ${allTors.length - alreadyMigrated.length - needsMigration.length} TORs`);

  if (needsMigration.length > 0) {
    console.log('\n⚠️  MIGRATION REQUIRED!');
    console.log('\nTORs that need migration:');
    needsMigration.forEach(tor => {
      console.log(`  - TOR #${tor.id} (${tor.number || 'No number'})`);
      if (tor.directorProposal && !tor.directorProposals) {
        console.log(`    📝 directorProposal needs migration`);
      }
      if (tor.fieldDirectorProposal && !tor.fieldDirectorProposals) {
        console.log(`    📝 fieldDirectorProposal needs migration`);
      }
    });
    console.log('\n💡 Run: npx tsx prisma/migrations/migrate-director-fields.ts');
  } else if (alreadyMigrated.length > 0) {
    console.log('\n✅ Migration already completed!');
    console.log('All TORs with director data have been migrated to the new format.');
  } else {
    console.log('\nℹ️  No TORs have director data yet. Migration not needed.');
  }
}

checkMigrationStatus()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
