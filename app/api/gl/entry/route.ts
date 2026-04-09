import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import Decimal from 'decimal.js'
import { assertPeriodOpen } from '@/lib/utils/period'
import { generateGlIds } from '@/lib/gl-engine/id-generator'
import type { ApiResponse, ManualGLPair } from '@/lib/types'

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Generate DocNum: YYYYMM + 6 digits, per (comcode, period) */
async function generateDocNum(comcode: string, period: string): Promise<string> {
  const seqName = `doc_manual_${comcode}_${period}`
  await prisma.$executeRawUnsafe(`
    CREATE SEQUENCE IF NOT EXISTS "${seqName}"
    START WITH 1 INCREMENT BY 1 NO MAXVALUE NO CYCLE
  `)
  const result = await prisma.$queryRawUnsafe<Array<{ nextval: bigint }>>(
    `SELECT nextval('"${seqName}"')`
  )
  const seq = String(result[0].nextval).padStart(6, '0')
  return `${period}${seq}`
}

/** Reconstruct ManualGLPair from 2 raw GL lines (Dr + Cr) */
function toPair(drLine: RawGLLine, crLine: RawGLLine): ManualGLPair {
  return {
    docNum: drLine.docNum,
    comcode: drLine.comcode,
    date: drLine.transDate.toISOString(),
    period: drLine.period,
    journalType: drLine.journalType,
    transAccount: drLine.accountCode,
    contraAccount: crLine.accountCode,
    currency: drLine.inputCurr,
    amount: new Decimal(drLine.inputDr.toString()).toFixed(2),
    partnerCode: drLine.partner ?? null,
    description: drLine.description ?? null,
    balanceImpact: drLine.balanceImpact ?? null,
    referenceTxnId: drLine.referenceTxnId ?? null,
    refNum: drLine.refNum ?? null,
    xRate: new Decimal(drLine.xRate.toString()).toFixed(6),
    glStatus: drLine.glStatus as ManualGLPair['glStatus'],
    createdAt: drLine.createdAt.toISOString(),
    createdBy: drLine.createdBy,
    drLineId: drLine.id,
    crLineId: crLine.id,
  }
}

type RawGLLine = {
  id: string
  comcode: string
  docNum: string
  journalType: string
  accountCode: number
  partner: string | null
  period: string
  transDate: Date
  inputCurr: string
  inputDr: Decimal
  inputCr: Decimal
  xRate: Decimal
  description: string | null
  balanceImpact: string | null
  referenceTxnId: string | null
  refNum: string | null
  glStatus: string
  createdAt: Date
  createdBy: string
}

// ─── GET /api/gl/entry ───────────────────────────────────────────────────────
// Query params: comcode, period, glStatus (Draft|Posted|all)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const comcode = searchParams.get('comcode') ?? ''
  const period = searchParams.get('period') ?? ''
  const glStatus = searchParams.get('glStatus') ?? 'all'

  const where: Record<string, unknown> = { dataSource: 'Manual' }
  if (comcode && comcode !== 'all') where.comcode = comcode
  if (period) where.period = period
  if (glStatus !== 'all') where.glStatus = glStatus

  const lines = await prisma.glEntry.findMany({
    where,
    orderBy: [{ docNum: 'asc' }, { inputDr: 'desc' }], // Dr lines first in each pair
    select: {
      id: true,
      comcode: true,
      docNum: true,
      journalType: true,
      accountCode: true,
      partner: true,
      period: true,
      transDate: true,
      inputCurr: true,
      inputDr: true,
      inputCr: true,
      xRate: true,
      description: true,
      balanceImpact: true,
      referenceTxnId: true,
      refNum: true,
      glStatus: true,
      createdAt: true,
      createdBy: true,
    },
  })

  // Group by docNum and reconstruct pairs
  const byDocNum = new Map<string, { dr?: RawGLLine; cr?: RawGLLine }>()
  for (const line of lines) {
    const key = `${line.comcode}_${line.docNum}`
    const entry = byDocNum.get(key) ?? {}
    if (new Decimal(line.inputDr.toString()).greaterThan(0)) {
      entry.dr = line as RawGLLine
    } else {
      entry.cr = line as RawGLLine
    }
    byDocNum.set(key, entry)
  }

  const pairs: ManualGLPair[] = []
  byDocNum.forEach(({ dr, cr }) => {
    if (dr && cr) pairs.push(toPair(dr, cr))
  })

  return NextResponse.json({
    data: pairs,
    meta: { total: pairs.length },
  } as ApiResponse<ManualGLPair[]>)
}

// ─── POST /api/gl/entry ──────────────────────────────────────────────────────
// Body: CreateManualGLPayload
export async function POST(req: NextRequest) {
  const body = await req.json() as CreateManualGLPayload

  const { comcode, period, journalType, transAccount, contraAccount,
    amount, currency, partnerCode, description, balanceImpact,
    referenceTxnId, refNum, date, createdBy } = body

  // Validate required fields
  if (!comcode || !period || !journalType || !transAccount || !contraAccount
    || !amount || !currency || !date) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Period lock check
  try {
    await assertPeriodOpen(prisma, comcode, period)
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Period locked' },
      { status: 422 }
    )
  }

  // Get company fncCurr
  const company = await prisma.company.findUnique({ where: { id: comcode } })
  if (!company) {
    return NextResponse.json({ error: `Company ${comcode} not found` }, { status: 404 })
  }

  const decimalAmount = new Decimal(amount)
  if (decimalAmount.lte(0)) {
    return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 })
  }

  const roundedAmount = decimalAmount.toDecimalPlaces(2)
  const transDate = new Date(date)
  const xRate = new Decimal(1)

  // Generate DocNum + 2 GL IDs
  const [docNum, glIds] = await Promise.all([
    generateDocNum(comcode, period),
    generateGlIds(prisma, period, 2),
  ])

  const commonFields = {
    comcode,
    dataSource: 'Manual' as const,
    journalType,
    docNum,
    period,
    transDate,
    docDate: transDate,
    inputCurr: currency,
    fncCurr: company.currency,
    xRate,
    rateType: 'Mul' as const,
    partner: partnerCode ?? null,
    description: description ?? null,
    balanceImpact: balanceImpact ?? null,
    referenceTxnId: referenceTxnId ?? null,
    refNum: refNum ?? null,
    glStatus: 'Draft',
    createdBy: createdBy ?? 'system',
    isReversal: false,
  }

  await prisma.glEntry.createMany({
    data: [
      {
        ...commonFields,
        id: glIds[0],
        accountCode: transAccount,
        inputDr: roundedAmount,
        inputCr: new Decimal(0),
        accountedDr: roundedAmount, // xRate=1 → accounted = input
        accountedCr: new Decimal(0),
      },
      {
        ...commonFields,
        id: glIds[1],
        accountCode: contraAccount,
        inputDr: new Decimal(0),
        inputCr: roundedAmount,
        accountedDr: new Decimal(0),
        accountedCr: roundedAmount,
      },
    ],
  })

  return NextResponse.json(
    { data: { docNum, drLineId: glIds[0], crLineId: glIds[1] } },
    { status: 201 }
  )
}

type CreateManualGLPayload = {
  comcode: string
  period: string
  journalType: string
  transAccount: number
  contraAccount: number
  amount: string
  currency: string
  date: string
  partnerCode?: string
  description?: string
  balanceImpact?: string
  referenceTxnId?: string
  refNum?: string
  createdBy?: string
}
