import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import Decimal from 'decimal.js'
import { assertPeriodOpen } from '@/lib/utils/period'
import type { ApiResponse } from '@/lib/types'

type Params = { params: Promise<{ id: string }> }

// ─── PUT /api/gl/entry/[docNum] ──────────────────────────────────────────────
// [id] here is the docNum. Body must include comcode for safety filtering.
export async function PUT(req: NextRequest, { params }: Params) {
  const { id: docNum } = await params
  const body = await req.json() as UpdateManualGLPayload

  if (!body.comcode) {
    return NextResponse.json({ error: 'comcode is required in request body' }, { status: 400 })
  }

  // Fetch existing lines — always filter by comcode to prevent cross-company deletion
  const lines = await prisma.glEntry.findMany({
    where: { docNum, dataSource: 'Manual', comcode: body.comcode },
  })

  if (lines.length !== 2) {
    return NextResponse.json(
      { error: `DocNum ${docNum} not found or not a simple pair` },
      { status: 404 }
    )
  }

  const drLine = lines.find((l) => new Decimal(l.inputDr.toString()).greaterThan(0))
  const crLine = lines.find((l) => new Decimal(l.inputCr.toString()).greaterThan(0))

  if (!drLine || !crLine) {
    return NextResponse.json({ error: 'Cannot identify Dr/Cr lines' }, { status: 400 })
  }

  if (drLine.glStatus !== 'Draft') {
    return NextResponse.json(
      { error: 'Only Draft entries can be edited. Use Reverse for Posted entries.' },
      { status: 422 }
    )
  }

  // Period lock — use the new period if changing, else current
  const targetPeriod = body.period ?? drLine.period
  const targetComcode = body.comcode ?? drLine.comcode
  try {
    await assertPeriodOpen(prisma, targetComcode, targetPeriod)
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Period locked' },
      { status: 422 }
    )
  }

  const roundedAmount = body.amount
    ? new Decimal(body.amount).toDecimalPlaces(2)
    : new Decimal(drLine.inputDr.toString())

  const transDate = body.date ? new Date(body.date) : drLine.transDate

  const patchCommon = {
    comcode: targetComcode,
    period: targetPeriod,
    journalType: body.journalType ?? drLine.journalType,
    transDate,
    docDate: transDate,
    inputCurr: body.currency ?? drLine.inputCurr,
    partner: body.partnerCode !== undefined ? (body.partnerCode ?? null) : drLine.partner,
    description: body.description !== undefined ? (body.description ?? null) : drLine.description,
    balanceImpact: body.balanceImpact !== undefined ? (body.balanceImpact ?? null) : drLine.balanceImpact,
    referenceTxnId: body.referenceTxnId !== undefined ? (body.referenceTxnId ?? null) : drLine.referenceTxnId,
    refNum: body.refNum !== undefined ? (body.refNum ?? null) : drLine.refNum,
  }

  await prisma.$transaction([
    prisma.glEntry.update({
      where: { id: drLine.id },
      data: {
        ...patchCommon,
        accountCode: body.transAccount ?? drLine.accountCode,
        inputDr: roundedAmount,
        accountedDr: roundedAmount,
      },
    }),
    prisma.glEntry.update({
      where: { id: crLine.id },
      data: {
        ...patchCommon,
        accountCode: body.contraAccount ?? crLine.accountCode,
        inputCr: roundedAmount,
        accountedCr: roundedAmount,
      },
    }),
  ])

  return NextResponse.json({ data: { docNum } } as ApiResponse<{ docNum: string }>)
}

// ─── DELETE /api/gl/entry/[docNum]?comcode= ──────────────────────────────────
export async function DELETE(req: NextRequest, { params }: Params) {
  const { id: docNum } = await params
  const comcode = new URL(req.url).searchParams.get('comcode')

  if (!comcode) {
    return NextResponse.json({ error: 'comcode query param is required' }, { status: 400 })
  }

  const lines = await prisma.glEntry.findMany({
    where: { docNum, dataSource: 'Manual', comcode },
    select: { id: true, glStatus: true, comcode: true, period: true },
  })

  if (lines.length === 0) {
    return NextResponse.json({ error: `DocNum ${docNum} not found` }, { status: 404 })
  }

  if (lines.some((l) => l.glStatus !== 'Draft')) {
    return NextResponse.json(
      { error: 'Cannot delete Posted entries. Use Reverse instead.' },
      { status: 422 }
    )
  }

  // Period lock check
  const { comcode, period } = lines[0]
  try {
    await assertPeriodOpen(prisma, comcode, period)
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Period locked' },
      { status: 422 }
    )
  }

  await prisma.glEntry.deleteMany({ where: { docNum, dataSource: 'Manual', comcode } })

  return NextResponse.json({ data: { docNum, deleted: lines.length } } as ApiResponse<unknown>)
}

type UpdateManualGLPayload = {
  comcode?: string
  period?: string
  journalType?: string
  transAccount?: number
  contraAccount?: number
  amount?: string
  currency?: string
  date?: string
  partnerCode?: string | null
  description?: string | null
  balanceImpact?: string | null
  referenceTxnId?: string | null
  refNum?: string | null
}
