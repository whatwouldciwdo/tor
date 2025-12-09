// Script to add EXPORT role to position #20
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addExportRole() {
  try {
    console.log('🔍 Finding EXPORT role...');
    
    // Find EXPORT role
    const exportRole = await prisma.role.findFirst({
      where: { name: 'EXPORT' }
    });
    
    if (!exportRole) {
      console.log('❌ EXPORT role not found in database');
      console.log('Creating EXPORT role...');
      
      const newRole = await prisma.role.create({
        data: {
          name: 'EXPORT',
          description: 'Can export TOR documents to Word'
        }
      });
      
      console.log('✅ EXPORT role created:', newRole);
      
      // Now add it to position #20
      await addRoleToPosition(newRole.id, 20);
    } else {
      console.log('✅ EXPORT role found:', exportRole);
      
      // Check if position #20 already has EXPORT role
      const existing = await prisma.positionRole.findFirst({
        where: {
          positionId: 20,
          roleId: exportRole.id
        }
      });
      
      if (existing) {
        console.log('ℹ️ Position #20 already has EXPORT role');
      } else {
        await addRoleToPosition(exportRole.id, 20);
      }
    }
    
    // Show updated position roles
    console.log('\n📋 Current roles for Position #20:');
    const position = await prisma.position.findUnique({
      where: { id: 20 },
      include: {
        positionRoles: {
          include: {
            role: true
          }
        }
      }
    });
    
    console.log(`Position: ${position?.name}`);
    position?.positionRoles.forEach(pr => {
      console.log(`  - ${pr.role.name} (ID: ${pr.role.id})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function addRoleToPosition(roleId: number, positionId: number) {
  console.log(`\n➕ Adding role to position #${positionId}...`);
  
  const result = await prisma.positionRole.create({
    data: {
      positionId: positionId,
      roleId: roleId
    }
  });
  
  console.log('✅ Role added successfully!');
  return result;
}

addExportRole();
