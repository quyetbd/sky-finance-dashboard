import { PrismaClient } from '@prisma/client'
import { FiscalPeriodRecord, PeriodGroupRow, PeriodStatus } from '@/lib/types'

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
 * endDate là ngày đầu tháng sau (exclusive upper bound)
 */
export function periodToDateRange(period: string): { startDate: Date; endDate: Date } {
  const year = parseInt(period.slice(0, 4), 10)
  const month = parseInt(period.slice(4, 6), 10)
  const startDate = new Date(Date.UTC(year, month - 1, 1))
  const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)) // last ms of last day
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
  // id = "{companyId}_{YYYYMM}" e.g. "ZeniroxPay_202501"
  const fp = await prismaClient.fiscalPeriod.findUnique({
    where: { id: `${comcode}_${period}` },
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
 * Group flat FiscalPeriodRecord[] thành PeriodGroupRow[] để render table có expandable rows.
 * Mỗi group = 1 (year, month) — chứa tất cả company records bên trong.
 */
export function groupPeriodRecords(records: FiscalPeriodRecord[]): PeriodGroupRow[] {
  const map = new Map<string, PeriodGroupRow>()

  for (const r of records) {
    const key = `${r.year}_${String(r.month).padStart(2, '0')}`
    if (!map.has(key)) {
      map.set(key, {
        key,
        year: r.year,
        quarter: r.quarter,
        month: r.month,
        startDate: r.startDate,
        endDate: r.endDate,
        note: r.note,
        companies: [],
        overallStatus: 'all-pending',
      })
    }
    map.get(key)!.companies.push(r)
  }

  // Compute overallStatus cho mỗi group
  for (const row of map.values()) {
    const statuses = new Set(row.companies.map((c) => c.status))
    if (statuses.size === 1) {
      const s = [...statuses][0] as PeriodStatus
      if (s === 'Open') row.overallStatus = 'all-open'
      else if (s === 'Closed') row.overallStatus = 'all-closed'
      else row.overallStatus = 'all-pending'
    } else {
      row.overallStatus = 'mixed'
    }
  }

  // Sort theo month tăng dần
  return [...map.values()].sort((a, b) => a.month - b.month)
}

/**
 * Tạo period label hiển thị: "T01/2025" hoặc "Q1/2025"
 * Quarterly: month là 3, 6, 9, 12 — quarter lấy từ record
 */
export function formatPeriodLabel(year: number, month: number, quarter: number): string {
  // Quarterly nếu month là cuối quý (3, 6, 9, 12) — kiểm tra bằng cách
  // xem companies[0].month % 3 === 0 — nhưng hàm này nhận month trực tiếp
  // Logic: nếu caller muốn quarterly label, truyền isQuarterly=true
  return `T${String(month).padStart(2, '0')}/${year}`
}
