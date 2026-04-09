import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse, PeriodStatus } from '@/lib/types'

// PATCH /api/periods/bulk-status
// Body: { year: number, month: number, status: 'Open' | 'Closed' }
// Cập nhật status của TẤT CẢ company trong cùng 1 kỳ (year + month)
//
// TODO(auth): Khi NextAuth được setup:
//   1. Chỉ update các company thuộc allowedComcodes của user
//   2. where: { year, month, companyId: { in: session.user.allowedComcodes } }
//   3. Chuyển Closed → Open chỉ cho phép Admin
export async function PATCH(req: NextRequest) {
  try {
    const body = (await req.json()) as { year: number; month: number; status: PeriodStatus }
    const { year, month, status } = body

    if (!year || !month || !['Pending', 'Open', 'Closed'].includes(status)) {
      return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 })
    }

    const result = await prisma.fiscalPeriod.updateMany({
      where: { year, month },
      data: { status },
    })

    return NextResponse.json({
      data: { count: result.count },
    } as ApiResponse<{ count: number }>)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi không xác định'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
