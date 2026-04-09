import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { ApiResponse, CompanyPayload, CompanyRow } from '@/lib/types'

type Params = { params: Promise<{ id: string }> }

// PUT /api/companies/:id
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = (await req.json()) as Partial<CompanyPayload>
    const { name, taxId, currency, status, country } = body

    const existing = await prisma.company.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const updated = await prisma.company.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(taxId !== undefined ? { taxId: taxId ?? null } : {}),
        ...(currency !== undefined ? { currency } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(country !== undefined ? { country } : {}),
      },
    })

    const data: CompanyRow = { ...updated, taxId: updated.taxId ?? null }
    return NextResponse.json({ data } as ApiResponse<CompanyRow>)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

// DELETE /api/companies/:id
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params

    const existing = await prisma.company.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await prisma.company.delete({ where: { id } })
    return NextResponse.json({ data: null } as ApiResponse<null>)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
