import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/lib/types'

export async function GET() {
  const accounts = await prisma.chartOfAccount.findMany({
    where: { status: 'Active' },
    orderBy: { accountCode: 'asc' },
  })

  return NextResponse.json({
    data: accounts,
    meta: { total: accounts.length },
  } as ApiResponse<typeof accounts>)
}
