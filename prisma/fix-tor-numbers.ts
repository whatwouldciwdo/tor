// Script to generate TOR numbers for existing TORs
// Run this with: npx tsx prisma/fix-tor-numbers.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Same function as in API route
function generateTorNumber(title: string, createdAt: Date): string {
  const titleSlug = (title || "draft")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 30);

  const day = String(createdAt.getDate()).padStart(2, "0");
  const month = String(createdAt.getMonth() + 1).padStart(2, "0");
  const year = createdAt.getFullYear();
  const dateStr = `${day}${month}${year}`;
  
  const ms = String(createdAt.getTime()).slice(-6);

  return `${titleSlug}-${dateStr}-${ms}`;
}

async function main() {
  console.log('🔍 Finding TORs without numbers...');
  
  // Find all TORs with NULL number
  const torsWithoutNumber = await prisma.tor.findMany({
    where: {
      number: null
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      number: true,
    }
  });

  console.log(`📊 Found ${torsWithoutNumber.length} TORs without numbers`);

  if (torsWithoutNumber.length === 0) {
    console.log('✅ All TORs already have numbers!');
    return;
  }

  console.log('\n🔧 Generating numbers...\n');

  for (const tor of torsWithoutNumber) {
    const torNumber = generateTorNumber(tor.title, tor.createdAt);
    
    console.log(`  TOR #${tor.id}:`);
    console.log(`    Title: ${tor.title}`);
    console.log(`    Old number: ${tor.number}`);
    console.log(`    New number: ${torNumber}`);

    // Update the TOR with the new number
    await prisma.tor.update({
      where: { id: tor.id },
      data: { number: torNumber }
    });

    console.log(`    ✅ Updated!\n`);
  }

  console.log(`\n✅ Successfully generated numbers for ${torsWithoutNumber.length} TORs!`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
