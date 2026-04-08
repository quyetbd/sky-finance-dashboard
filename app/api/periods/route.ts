import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse, FiscalPeriodRecord } from '@/lib/types'

// GET /api/periods?year=2025&status=Open&comcode=ZeniroxPay
// Trả về flat array FiscalPeriod records, hỗ trợ filter theo year, status, comcode
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const yearParam = searchParams.get('year')
  const statusParam = searchParams.get('status')
  const comcodeParam = searchParams.get('comcode')

  const where: { year?: number; status?: string; companyId?: string } = {}
  if (yearParam) {
    const year = parseInt(yearParam, 10)
    if (!isNaN(year)) where.year = year
  }
  if (statusParam) where.status = statusParam
  if (comcodeParam && comcodeParam !== 'all') where.companyId = comcodeParam

  const periods = await prisma.fiscalPeriod.findMany({
    where,
    orderBy: [{ year: 'asc' }, { month: 'asc' }, { companyId: 'asc' }],
  })

  // Serialize Date → ISO string (JSON.stringify làm tự động, nhưng cast tường minh cho type safety)
  const data: FiscalPeriodRecord[] = periods.map((p) => ({
    ...p,
    startDate: p.startDate.toISOString(),
    endDate: p.endDate.toISOString(),
    status: p.status as FiscalPeriodRecord['status'],
  }))

  return NextResponse.json({
    data,
    meta: { total: data.length },
  } as ApiResponse<FiscalPeriodRecord[]>)
}
