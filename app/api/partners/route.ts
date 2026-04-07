import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/lib/types'

export async function GET() {
  const partners = await prisma.partner.findMany({
    orderBy: { partnerCode: 'asc' },
  })

  return NextResponse.json({
    data: partners,
    meta: { total: partners.length },
  } as ApiResponse<typeof partners>)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const partner = await prisma.partner.create({ data: body })

    return NextResponse.json(
      { data: partner } as ApiResponse<typeof partner>,
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
