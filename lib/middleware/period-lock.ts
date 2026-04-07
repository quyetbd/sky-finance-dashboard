/**
 * Period Lock Middleware — Enforce period status check
 *
 * Được gọi trước mọi write operation:
 *   - GL post, upload staging, GL Entry manual, invoice save
 *
 * Throws PeriodLockedError nếu period không Open
 */

import { NextRequest, NextResponse } from 'next/server'
import { PeriodLockedError } from '@/lib/utils/period'

/**
 * Middleware to check period lock before API write
 * Usage in route handler:
 *
 * export async function POST(req: NextRequest) {
 *   const { comcode, period } = await req.json()
 *   await checkPeriodLock(comcode, period)
 *   // ... proceed with write
 * }
 */
export async function checkPeriodLock(comcode: string, period: string): Promise<void> {
  // Dynamic import để tránh circular dependency
  const { prisma } = await import('@/lib/prisma')

  const fp = await prisma.fiscalPeriod.findFirst({
    where: { id: period, companyId: comcode },
  })

  if (!fp) {
    throw new PeriodLockedError(
      `Period ${period} của ${comcode} chưa được tạo. Vui lòng tạo kỳ kế toán trước.`
    )
  }

  if (fp.status === 'Closed') {
    throw new PeriodLockedError(
      `Period ${period} của ${comcode} đã đóng. Không thể ghi thêm dữ liệu.`
    )
  }

  if (fp.status === 'Pending') {
    throw new PeriodLockedError(
      `Period ${period} của ${comcode} chưa mở (trạng thái: Pending).`
    )
  }
}

/**
 * Error handler wrapper để format error response
 */
export function handlePeriodLockError(error: unknown) {
  if (error instanceof PeriodLockedError) {
    return NextResponse.json(
      { error: error.message },
      { status: 403 } // Forbidden
    )
  }

  throw error
}
