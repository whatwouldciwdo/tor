// Script to delete and re-create Battery template with correct renderMode
const { PrismaClient } = require('@prisma/client');
const batteryTemplateData = require('./battery-template-data.cjs');

const prisma = new PrismaClient();

async function resetBatteryTemplate() {
  try {
    console.log('🗑️  Deleting existing Battery template...');
    await prisma.lampiranTemplate.deleteMany({
      where: { name: 'Battery' }
    });
    console.log('✅ Battery template deleted');
    
    console.log('\n📝 Creating new Battery template with renderMode: table...');
    await prisma.lampiranTemplate.create({
      data: {
        name: batteryTemplateData.name,
        renderMode: batteryTemplateData.renderMode, // Should be "table"
        technicalParticulars: batteryTemplateData.technicalParticulars,
        inspectionTestingPlans: batteryTemplateData.inspectionTestingPlans || [],
        documentRequestSheets: batteryTemplateData.documentRequestSheets || [],
        performanceGuarantees: batteryTemplateData.performanceGuarantees || []
      }
    });
    console.log('✅ Battery template created with renderMode:', batteryTemplateData.renderMode);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetBatteryTemplate();
