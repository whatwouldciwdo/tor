// lib/api-response.ts
/**
 * Standardized API response helpers with proper error handling
 */

import { NextResponse } from 'next/server';

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

export interface ApiSuccessResponse<T = any> {
  data?: T;
  message?: string;
}

export interface ApiErrorResponse {
  error: ApiError;
}

/**
 * Success response helper
 */
export function successResponse<T>(
  data?: T,
  message?: string,
  status: number = 200
): NextResponse {
  return NextResponse.json(
    {
      data,
      message,
    } as ApiSuccessResponse<T>,
    { status }
  );
}

/**
 * Error response helper
 */
export function errorResponse(
  message: string,
  status: number = 500,
  code?: string,
  field?: string
): NextResponse {
  return NextResponse.json(
    {
      error: {
        message,
        code,
        field,
      },
    } as ApiErrorResponse,
    { status }
  );
}

/**
 * Handle Prisma errors and return appropriate response
 */
export function handlePrismaError(error: any): NextResponse {
  console.error('Database error:', error);

  // P2002: Unique constraint violation
  if (error.code === 'P2002') {
    const field = error.meta?.target?.[0] || 'field';
    return errorResponse(
      `${field} sudah digunakan`,
      409,
      'DUPLICATE_ENTRY',
      field
    );
  }

  // P2025: Record not found
  if (error.code === 'P2025') {
    return errorResponse('Data tidak ditemukan', 404, 'NOT_FOUND');
  }

  // P2024: Connection timeout
  if (error.code === 'P2024') {
    return errorResponse(
      'Database connection timeout. Silakan coba lagi.',
      503,
      'DB_TIMEOUT'
    );
  }

  // P2034: Transaction conflict / serialization failure
  if (error.code === 'P2034') {
    return errorResponse(
      'Konflik transaksi. Silakan coba lagi.',
      409,
      'TRANSACTION_CONFLICT'
    );
  }

  // P1001: Can't reach database server
  if (error.code === 'P1001') {
    return errorResponse(
      'Tidak dapat terhubung ke database. Silakan coba lagi.',
      503,
      'DB_UNREACHABLE'
    );
  }

  // P1002: Database server timeout
  if (error.code === 'P1002') {
    return errorResponse(
      'Database server timeout. Silakan coba lagi.',
      503,
      'DB_TIMEOUT'
    );
  }

  // Generic database error
  return errorResponse(
    'Terjadi kesalahan pada database. Silakan coba lagi.',
    500,
    'DB_ERROR'
  );
}

/**
 * Rate limit response
 */
export function rateLimitResponse(resetAt: number): NextResponse {
  const resetDate = new Date(resetAt);
  
  const response = NextResponse.json(
    {
      error: {
        message: 'Terlalu banyak request. Silakan coba lagi nanti.',
        code: 'RATE_LIMIT_EXCEEDED',
        resetAt: resetDate.toISOString(),
      },
    } as ApiErrorResponse,
    { status: 429 }
  );

  response.headers.set('Retry-After', Math.ceil((resetAt - Date.now()) / 1000).toString());
  
  return response;
}

/**
 * Add rate limit headers to response
 */
export function addRateLimitHeaders(
  response: NextResponse,
  limit: number,
  remaining: number,
  resetAt: number
): NextResponse {
  response.headers.set('X-RateLimit-Limit', limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', Math.ceil(resetAt / 1000).toString());
  
  return response;
}
