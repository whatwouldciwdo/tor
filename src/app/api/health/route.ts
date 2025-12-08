import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Create a local Prisma instance for health check to avoid import issues
const prisma = new PrismaClient();

/**
 * Health check endpoint for monitoring
 * GET /api/health
 */
export async function GET() {
  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error: any) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error.message,
      },
      { status: 503 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
