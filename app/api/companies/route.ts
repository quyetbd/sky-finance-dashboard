import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/lib/types'

export async function GET() {
  const companies = await prisma.company.findMany({
    where: { status: 'Active' },
  })

  return NextResponse.json({
    data: companies,
    meta: { total: companies.length },
  } as ApiResponse<typeof companies>)
}
