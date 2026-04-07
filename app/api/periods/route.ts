import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/lib/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const companyId = searchParams.get('companyId')

  const where: any = {}
  if (companyId) where.companyId = companyId

  const periods = await prisma.fiscalPeriod.findMany({
    where,
    orderBy: { id: 'desc' },
  })

  return NextResponse.json({
    data: periods,
    meta: { total: periods.length },
  } as ApiResponse<typeof periods>)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const period = await prisma.fiscalPeriod.create({ data: body })

    return NextResponse.json(
      { data: period } as ApiResponse<typeof period>,
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
