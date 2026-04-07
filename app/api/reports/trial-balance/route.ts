import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateTrialBalance } from '@/lib/reports/trial-balance'
import { ApiResponse } from '@/lib/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const comcode = searchParams.get('comcode')
  const period = searchParams.get('period')

  if (!comcode || !period) {
    return NextResponse.json(
      { error: 'comcode and period required' },
      { status: 400 }
    )
  }

  try {
    const rows = await generateTrialBalance(prisma, comcode, period)
    return NextResponse.json({
      data: rows,
      meta: { total: rows.length },
    } as ApiResponse<typeof rows>)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
