import { NextResponse, NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { ApiResponse, ChartOfAccountPayload, ChartOfAccountRow } from '@/lib/types'

type Params = { params: Promise<{ id: string }> }

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

// PUT /api/chart-of-accounts/:id — Admin only
export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'Admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { id } = await params
    const accountCode = Number(id)

    const existing = await prisma.chartOfAccount.findUnique({ where: { accountCode } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const body = (await req.json()) as Partial<ChartOfAccountPayload>
    const { accountName, accountType, balanceSide, status, arap, arapType } = body

    const updated = await prisma.chartOfAccount.update({
      where: { accountCode },
      data: {
        ...(accountName !== undefined ? { accountName } : {}),
        ...(accountType !== undefined ? { accountType } : {}),
        ...(balanceSide !== undefined ? { balanceSide } : {}),
        ...(status      !== undefined ? { status }      : {}),
        ...(arap        !== undefined ? { arap: arap ?? null }         : {}),
        ...(arapType    !== undefined ? { arapType: arapType ?? null } : {}),
      },
    })

    return NextResponse.json({ data: toRow(updated) } as ApiResponse<ChartOfAccountRow>)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

// DELETE /api/chart-of-accounts/:id — Admin only
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'Admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { id } = await params
    const accountCode = Number(id)

    const existing = await prisma.chartOfAccount.findUnique({ where: { accountCode } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await prisma.chartOfAccount.delete({ where: { accountCode } })
    return NextResponse.json({ data: null } as ApiResponse<null>)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
