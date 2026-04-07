import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/lib/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const period = searchParams.get('period')
  const inputCurr = searchParams.get('inputCurr')

  const where: any = {}
  if (period) where.period = period
  if (inputCurr) where.inputCurr = inputCurr

  const rates = await prisma.exchangeRate.findMany({ where })

  return NextResponse.json({
    data: rates,
    meta: { total: rates.length },
  } as ApiResponse<typeof rates>)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const rate = await prisma.exchangeRate.create({ data: body })

    return NextResponse.json(
      { data: rate } as ApiResponse<typeof rate>,
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
