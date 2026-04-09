import { NextResponse, NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { ApiResponse, ChartOfAccountPayload, ChartOfAccountRow } from '@/lib/types'

function toRow(c: {
  accountCode: number
  accountName: string
  accountType: string
  balanceSide: string
  status: string
  arap: string | null
  arapType: string | null
  createdAt: Date
  updatedAt: Date
}): ChartOfAccountRow {
  return {
    accountCode: c.accountCode,
    accountName: c.accountName,
    accountType: c.accountType,
    balanceSide: c.balanceSide,
    status:      c.status,
    arap:        c.arap,
    arapType:    c.arapType,
    createdAt:   c.createdAt.toISOString(),
    updatedAt:   c.updatedAt.toISOString(),
  }
}

// GET /api/chart-of-accounts
export async function GET() {
  const records = await prisma.chartOfAccount.findMany({
    orderBy: { accountCode: 'asc' },
  })
  const data: ChartOfAccountRow[] = records.map(toRow)
  return NextResponse.json({ data, meta: { total: data.length } } as ApiResponse<ChartOfAccountRow[]>)
}

// POST /api/chart-of-accounts — Admin only
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'Admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = (await req.json()) as ChartOfAccountPayload
    const { accountCode, accountName, accountType, balanceSide, status, arap, arapType } = body

    if (!accountCode || !accountName || !accountType || !balanceSide || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existing = await prisma.chartOfAccount.findUnique({ where: { accountCode } })
    if (existing) {
      return NextResponse.json({ error: `AccountCode "${accountCode}" already exists` }, { status: 409 })
    }

    const created = await prisma.chartOfAccount.create({
      data: {
        accountCode,
        accountName,
        accountType,
        balanceSide,
        status,
        arap:     arap     ?? null,
        arapType: arapType ?? null,
      },
    })

    return NextResponse.json({ data: toRow(created) } as ApiResponse<ChartOfAccountRow>, { status: 201 })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
