import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { ApiResponse, ExchangeRatePayload, ExchangeRateRow } from '@/lib/types'

// GET /api/exchange-rates?period=202501[&inputCurr=VND]
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const period = searchParams.get('period')
  const inputCurr = searchParams.get('inputCurr')

  if (!period) {
    return NextResponse.json({ error: 'period is required' }, { status: 400 })
  }

  const records = await prisma.exchangeRate.findMany({
    where: { period, ...(inputCurr ? { inputCurr } : {}) },
    orderBy: [{ fncCurr: 'asc' }, { inputCurr: 'asc' }],
  })

  const data: ExchangeRateRow[] = records.map((r) => ({
    id: r.id,
    period: r.period,
    date: r.date.toISOString(),
    fncCurr: r.fncCurr,
    inputCurr: r.inputCurr,
    rateType: r.rateType as ExchangeRateRow['rateType'],
    rate: r.rate.toString(),
  }))

  return NextResponse.json({ data, meta: { total: data.length } } as ApiResponse<ExchangeRateRow[]>)
}

// POST /api/exchange-rates
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ExchangeRatePayload
    const { period, date, fncCurr, inputCurr, rateType, rate } = body

    if (!period || !date || !fncCurr || !inputCurr || !rateType || !rate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!['Mul', 'Div'].includes(rateType)) {
      return NextResponse.json({ error: 'rateType must be Mul or Div' }, { status: 400 })
    }

    // Period lock: at least one company's period must be Open
    const year = parseInt(period.slice(0, 4), 10)
    const month = parseInt(period.slice(4, 6), 10)
    const openCount = await prisma.fiscalPeriod.count({ where: { year, month, status: 'Open' } })
    if (openCount === 0) {
      return NextResponse.json({ error: 'Period is closed or not initialized' }, { status: 409 })
    }

    const created = await prisma.exchangeRate.create({
      data: { period, date: new Date(date), fncCurr, inputCurr, rateType, rate },
    })

    const data: ExchangeRateRow = {
      id: created.id,
      period: created.period,
      date: created.date.toISOString(),
      fncCurr: created.fncCurr,
      inputCurr: created.inputCurr,
      rateType: created.rateType as ExchangeRateRow['rateType'],
      rate: created.rate.toString(),
    }
    return NextResponse.json({ data } as ApiResponse<ExchangeRateRow>, { status: 201 })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
