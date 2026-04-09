import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse, InitializePayload } from '@/lib/types'
import { periodToDateRange } from '@/lib/utils/period'

// POST /api/periods/initialize
// Body: { year: number, periodType: 'Tháng' | 'Quý', note: string }
// Tạo N tháng (hoặc 4 quý) × M công ty active
//
// TODO(auth): Khi NextAuth được setup:
//   1. Lấy session và kiểm tra role: Admin only
//   2. if (session.user.role !== 'Admin') return 403
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as InitializePayload
    const { year, periodType, note } = body

    if (!year || isNaN(year) || year < 2000 || year > 2100) {
      return NextResponse.json({ error: 'Năm tài chính không hợp lệ.' }, { status: 400 })
    }

    // Kiểm tra năm đã được khởi tạo chưa
    const existing = await prisma.fiscalPeriod.findFirst({ where: { year } })
    if (existing) {
      return NextResponse.json(
        { error: 'Năm đã khởi tạo kỳ, thì không cho phép khởi tạo lần 2.' },
        { status: 400 }
      )
    }

    // Load tất cả công ty active
    const companies = await prisma.company.findMany({
      where: { status: 'Active' },
      select: { id: true },
    })

    if (companies.length === 0) {
      return NextResponse.json(
        { error: 'Không có công ty nào đang hoạt động.' },
        { status: 400 }
      )
    }

    // Xác định danh sách tháng cần tạo
    // Tháng: 1–12, Quý: tháng cuối quý = 3, 6, 9, 12
    const months: { month: number; quarter: number }[] =
      periodType === 'Quý'
        ? [
            { month: 3, quarter: 1 },
            { month: 6, quarter: 2 },
            { month: 9, quarter: 3 },
            { month: 12, quarter: 4 },
          ]
        : Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            quarter: Math.ceil((i + 1) / 3),
          }))

    // Build records: company × period
    const records = companies.flatMap(({ id: companyId }) =>
      months.map(({ month, quarter }) => {
        const periodStr = `${year}${String(month).padStart(2, '0')}`
        const { startDate, endDate } = periodToDateRange(periodStr)
        return {
          id: `${companyId}_${periodStr}`,
          companyId,
          year,
          quarter,
          month,
          startDate,
          endDate,
          status: 'Pending',
          note,
        }
      })
    )

    const result = await prisma.fiscalPeriod.createMany({ data: records })

    return NextResponse.json(
      { data: { count: result.count } } as ApiResponse<{ count: number }>,
      { status: 201 }
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi không xác định'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
