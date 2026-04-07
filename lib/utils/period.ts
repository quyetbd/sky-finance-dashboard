import { PrismaClient } from '@prisma/client'

export class PeriodLockedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PeriodLockedError'
  }
}

/**
 * Trả về period hiện tại dạng "YYYYMM"
 */
export function getCurrentPeriod(): string {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = String(now.getUTCMonth() + 1).padStart(2, '0')
  return `${year}${month}`
}

/**
 * Tính period từ một Date object
 */
export function dateToPeriod(date: Date): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${year}${month}`
}

/**
 * Chuyển "YYYYMM" → { startDate, endDate } (UTC)
 */
export function periodToDateRange(period: string): { startDate: Date; endDate: Date } {
  const year = parseInt(period.slice(0, 4), 10)
  const month = parseInt(period.slice(4, 6), 10)
  const startDate = new Date(Date.UTC(year, month - 1, 1))
  const endDate = new Date(Date.UTC(year, month, 1)) // exclusive upper bound
  return { startDate, endDate }
}

/**
 * Throws PeriodLockedError nếu period không tồn tại hoặc không ở trạng thái Open.
 * Gọi trước MỌI write operation: GL post, upload staging, GL Entry manual, invoice save.
 *
 * @param prismaClient - Prisma client instance (truyền vào để dùng cùng transaction)
 * @param comcode      - Comcode của pháp nhân
 * @param period       - "YYYYMM"
 */
export async function assertPeriodOpen(
  prismaClient: PrismaClient,
  comcode: string,
  period: string
): Promise<void> {
  const fp = await prismaClient.fiscalPeriod.findFirst({
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
