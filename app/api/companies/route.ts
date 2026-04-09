import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { ApiResponse, CompanyPayload, CompanyRow } from '@/lib/types'

// GET /api/companies[?status=Active]
// Without status param → returns all companies (for config management)
// With ?status=Active → returns active only (for dropdowns)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')

  const records = await prisma.company.findMany({
    where: status ? { status } : undefined,
    orderBy: { id: 'asc' },
  })

  const data: CompanyRow[] = records.map((c) => ({
    id: c.id,
    name: c.name,
    taxId: c.taxId ?? null,
    currency: c.currency,
    status: c.status,
    country: c.country,
  }))

  return NextResponse.json({ data, meta: { total: data.length } } as ApiResponse<CompanyRow[]>)
}

// POST /api/companies
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CompanyPayload
    const { id, name, taxId, currency, status, country } = body

    if (!id || !name || !currency || !country) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existing = await prisma.company.findUnique({ where: { id } })
    if (existing) {
      return NextResponse.json({ error: `Comcode "${id}" already exists` }, { status: 409 })
    }

    const created = await prisma.company.create({
      data: { id, name, taxId: taxId ?? null, currency, status: status || 'Active', country },
    })

    const data: CompanyRow = { ...created, taxId: created.taxId ?? null }
    return NextResponse.json({ data } as ApiResponse<CompanyRow>, { status: 201 })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
