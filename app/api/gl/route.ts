import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/lib/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const comcode = searchParams.get('comcode')
  const period = searchParams.get('period')

  if (!comcode || !period) {
    return NextResponse.json(
      { error: 'comcode and period required' },
      { status: 400 }
    )
  }

  const entries = await prisma.glEntry.findMany({
    where: { comcode, period },
    take: 1000, // Limit cho dev
    orderBy: { id: 'asc' },
  })

  return NextResponse.json({
    data: entries,
    meta: { total: entries.length },
  } as ApiResponse<typeof entries>)
}
