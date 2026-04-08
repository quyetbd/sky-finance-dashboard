import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { ApiResponse } from '@/lib/types'
import type { Prisma } from '@prisma/client'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const comcode = searchParams.get('comcode')
  const period = searchParams.get('period')
  const fromDate = searchParams.get('fromDate')
  const toDate = searchParams.get('toDate')
  const dataSource = searchParams.get('dataSource')
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const pageSize = Math.min(500, Math.max(1, parseInt(searchParams.get('pageSize') ?? '100')))

  if (!comcode) {
    return NextResponse.json({ error: 'comcode required' }, { status: 400 })
  }

  const where: Prisma.GlEntryWhereInput = {}

  if (comcode !== 'all') where.comcode = comcode
  if (period) where.period = period
  if (dataSource && dataSource !== 'all') where.dataSource = dataSource

  if (fromDate || toDate) {
    where.transDate = {
      ...(fromDate ? { gte: new Date(fromDate) } : {}),
      ...(toDate ? { lte: new Date(`${toDate}T23:59:59.999Z`) } : {}),
    }
  }

  const skip = (page - 1) * pageSize

  const [entries, total] = await Promise.all([
    prisma.glEntry.findMany({
      where,
      take: pageSize,
      skip,
      orderBy: { id: 'asc' },
    }),
    prisma.glEntry.count({ where }),
  ])

  return NextResponse.json({
    data: entries,
    meta: { total, page, pageSize },
  } as ApiResponse<typeof entries>)
}
