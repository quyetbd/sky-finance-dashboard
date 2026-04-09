import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse, FiscalPeriodRecord, PeriodStatus } from '@/lib/types'

// PATCH /api/periods/:id
// Body: { status: 'Open' | 'Closed' | 'Pending' }
// Cập nhật status của 1 company trong 1 kỳ
//
// TODO(auth): Khi NextAuth được setup:
//   1. Kiểm tra user có quyền với companyId trong id (id = "{companyId}_{YYYYMM}")
//   2. Chuyển Closed → Open chỉ cho phép Admin
//   3. const companyId = id.split('_')[0]; kiểm tra allowedComcodes
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = (await req.json()) as { status: PeriodStatus }

    if (!['Pending', 'Open', 'Closed'].includes(body.status)) {
      return NextResponse.json({ error: 'Status không hợp lệ.' }, { status: 400 })
    }

    const updated = await prisma.fiscalPeriod.update({
      where: { id },
      data: { status: body.status },
    })

    const data: FiscalPeriodRecord = {
      ...updated,
      startDate: updated.startDate.toISOString(),
      endDate: updated.endDate.toISOString(),
      status: updated.status as PeriodStatus,
    }

    return NextResponse.json({ data } as ApiResponse<FiscalPeriodRecord>)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi không xác định'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
