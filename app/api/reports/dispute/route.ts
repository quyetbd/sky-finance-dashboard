import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateDisputeReport } from '@/lib/reports/dispute'
import { ApiResponse } from '@/lib/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const comcode = searchParams.get('comcode')
  const status = searchParams.get('status')

  if (!comcode) {
    return NextResponse.json(
      { error: 'comcode required' },
      { status: 400 }
    )
  }

  try {
    const rows = await generateDisputeReport(
      prisma,
      comcode,
      status || undefined
    )
    return NextResponse.json({
      data: rows,
      meta: { total: rows.length },
    } as ApiResponse<typeof rows>)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
