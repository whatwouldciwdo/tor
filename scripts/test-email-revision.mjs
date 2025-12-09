// Test script for revision email notification
import 'dotenv/config';
import { sendRevisionNotification } from '../src/lib/email.ts';

async function testRevisionEmail() {
  console.log('📧 Testing Revision Email Notification...\n');

  const testParams = {
    to: process.env.SMTP_USER || 'sispltguclg@gmail.com',
    torNumber: '2025-08122025-TEST001',
    torTitle: 'Pengadaan Equipment Testing Rev 1',
    revisionNote: 'Mohon diperbaiki pada bagian budget estimation. Perlu ditambahkan rincian biaya material dan tenaga kerja. Juga lampirkan dokumen pendukung yang lebih lengkap.',
    revisorName: 'Manager Teknik - Budi Santoso',
    editLink: 'http://localhost:3000/tor/99'
  };

  console.log('📋 Test Data:');
  console.log(`   To: ${testParams.to}`);
  console.log(`   TOR Number: ${testParams.torNumber}`);
  console.log(`   Title: ${testParams.torTitle}`);
  console.log(`   Revisor: ${testParams.revisorName}\n`);

  try {
    const result = await sendRevisionNotification(testParams);
    
    if (result.success) {
      console.log('✅ Revision email sent successfully!');
      console.log(`   Message ID: ${result.messageId}`);
      console.log('\n🎉 Check your inbox for the revision notification!');
    } else {
      console.log('❌ Failed to send email:', result.message || result.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testRevisionEmail();
