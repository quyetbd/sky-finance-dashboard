import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { ApiResponse } from '@/lib/types'

// GET /api/journal-types?q=&dataSource=
// Trả về danh sách JournalTypeRule, hỗ trợ tìm kiếm theo tên + filter theo dataSource
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim() ?? ''
  const dataSource = searchParams.get('dataSource') ?? ''

  const rules = await prisma.journalTypeRule.findMany({
    where: {
      ...(q ? { journalType: { contains: q, mode: 'insensitive' } } : {}),
      ...(dataSource ? { dataSource } : {}),
    },
    orderBy: { journalType: 'asc' },
    take: 50,
  })

  return NextResponse.json({
    data: rules,
    meta: { total: rules.length },
  } as ApiResponse<typeof rules>)
}
