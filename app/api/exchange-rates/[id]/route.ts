import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { ApiResponse, ExchangeRatePayload, ExchangeRateRow } from '@/lib/types'

type Params = { params: Promise<{ id: string }> }

async function resolveId(params: Params['params']): Promise<number | null> {
  const { id } = await params
  const n = parseInt(id, 10)
  return isNaN(n) ? null : n
}

// PUT /api/exchange-rates/:id
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const numId = await resolveId(params)
    if (numId === null) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

    const body = (await req.json()) as Partial<ExchangeRatePayload>
    const { date, fncCurr, inputCurr, rateType, rate } = body

    if (rateType && !['Mul', 'Div'].includes(rateType)) {
      return NextResponse.json({ error: 'rateType must be Mul or Div' }, { status: 400 })
    }

    const existing = await prisma.exchangeRate.findUnique({ where: { id: numId } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Period lock check
    const year = parseInt(existing.period.slice(0, 4), 10)
    const month = parseInt(existing.period.slice(4, 6), 10)
    const openCount = await prisma.fiscalPeriod.count({ where: { year, month, status: 'Open' } })
    if (openCount === 0) {
      return NextResponse.json({ error: 'Period is closed' }, { status: 409 })
    }

    const updated = await prisma.exchangeRate.update({
      where: { id: numId },
      data: {
        ...(date ? { date: new Date(date) } : {}),
        ...(fncCurr ? { fncCurr } : {}),
        ...(inputCurr ? { inputCurr } : {}),
        ...(rateType ? { rateType } : {}),
        ...(rate ? { rate } : {}),
      },
    })

    const data: ExchangeRateRow = {
      id: updated.id,
      period: updated.period,
      date: updated.date.toISOString(),
      fncCurr: updated.fncCurr,
      inputCurr: updated.inputCurr,
      rateType: updated.rateType as ExchangeRateRow['rateType'],
      rate: updated.rate.toString(),
    }
    return NextResponse.json({ data } as ApiResponse<ExchangeRateRow>)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

// DELETE /api/exchange-rates/:id
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const numId = await resolveId(params)
    if (numId === null) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

    const existing = await prisma.exchangeRate.findUnique({ where: { id: numId } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Period lock check
    const year = parseInt(existing.period.slice(0, 4), 10)
    const month = parseInt(existing.period.slice(4, 6), 10)
    const openCount = await prisma.fiscalPeriod.count({ where: { year, month, status: 'Open' } })
    if (openCount === 0) {
      return NextResponse.json({ error: 'Period is closed' }, { status: 409 })
    }

    await prisma.exchangeRate.delete({ where: { id: numId } })
    return NextResponse.json({ data: null } as ApiResponse<null>)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
