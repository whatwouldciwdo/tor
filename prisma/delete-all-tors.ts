import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteAllTors() {
  try {
    console.log('🗑️  Deleting all TOR records...');
    
    // Delete in order due to foreign key constraints
    // 1. Delete TorApprovalHistory first
    const deletedHistory = await prisma.torApprovalHistory.deleteMany({});
    console.log(`✅ Deleted ${deletedHistory.count} TorApprovalHistory records`);
    
    // 2. Delete TorBudgetItem
    const deletedBudgetItems = await prisma.torBudgetItem.deleteMany({});
    console.log(`✅ Deleted ${deletedBudgetItems.count} TorBudgetItem records`);
    
    // 3. Finally delete all TORs
    const deletedTors = await prisma.tor.deleteMany({});
    console.log(`✅ Deleted ${deletedTors.count} TOR records`);
    
    console.log('\n✨ All TOR records have been deleted successfully!');
  } catch (error) {
    console.error('❌ Error deleting TORs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllTors();
