import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking AVR template in database...\n');
  
  const avrTemplate = await prisma.lampiranTemplate.findUnique({
    where: { name: 'AVR' }
  });
  
  if (!avrTemplate) {
    console.log('❌ AVR template not found!');
    return;
  }
  
  console.log('📋 Template Name:', avrTemplate.name);
  console.log('📋 Description:', avrTemplate.description);
  console.log('\n📊 TPG Columns:', JSON.stringify(avrTemplate.tpgColumns, null, 2));
  console.log('\n📝 First TPG Item:', JSON.stringify(avrTemplate.technicalParticulars[0], null, 2));
  console.log('\n📝 Second TPG Item:', JSON.stringify(avrTemplate.technicalParticulars[1], null, 2));
  
  // Check if items have the correct fields
  const firstDataItem = avrTemplate.technicalParticulars[1]; // Skip header
  const itemKeys = Object.keys(firstDataItem).filter(k => k !== 'id');
  
  console.log('\n🔑 Keys in data:', itemKeys);
  console.log('✅ Has unit?', itemKeys.includes('unit'));
  console.log('✅ Has required?', itemKeys.includes('required'));
  console.log('✅ Has proposedGuaranteed?', itemKeys.includes('proposedGuaranteed'));
  console.log('✅ Has remarks?', itemKeys.includes('remarks'));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
