import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { assertPeriodOpen } from '@/lib/utils/period'
import { validateDoubleEntry } from '@/lib/gl-engine/validate'
import type { ApiResponse } from '@/lib/types'

// POST /api/gl/post
// Body: { uids: string[] }
// Validate Dr=Cr per docNum+comcode, then mark glStatus = 'Posted'
export async function POST(req: NextRequest) {
  const body = await req.json() as { uids: string[] }
  const { uids } = body

  if (!Array.isArray(uids) || uids.length === 0) {
    return NextResponse.json({ error: 'uids array is required' }, { status: 400 })
  }

  const orCondition = uids.map(uid => {
    const [comcode, docNum] = uid.split('_')
    return { comcode, docNum }
  })

  // Fetch all lines for these docNums
  const lines = await prisma.glEntry.findMany({
    where: { OR: orCondition, dataSource: 'Manual' },
    select: {
      id: true,
      docNum: true,
      comcode: true,
      period: true,
      glStatus: true,
      accountedDr: true,
      accountedCr: true,
    },
  })

  if (lines.length === 0) {
    return NextResponse.json({ error: 'No Manual GL entries found for given docNums' }, { status: 404 })
  }

  // Check all are Draft
  const alreadyPosted = lines.filter((l) => l.glStatus !== 'Draft').map((l) => l.docNum)
  if (alreadyPosted.length > 0) {
    return NextResponse.json(
      { error: `These docNums are already Posted: ${Array.from(new Set(alreadyPosted)).join(', ')}` },
      { status: 422 }
    )
  }

  // Check period open for each unique (comcode, period)
  const combos = Array.from(new Map(lines.map((l) => [`${l.comcode}|${l.period}`, l])).values())
  for (const { comcode, period } of combos) {
    try {
      await assertPeriodOpen(prisma, comcode, period)
    } catch (e: unknown) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : 'Period locked' },
        { status: 422 }
      )
    }
  }

  // Double-entry validation
  try {
    validateDoubleEntry(
      lines.map((l) => ({
        docNum: l.docNum,
        accountedDr: l.accountedDr,
        accountedCr: l.accountedCr,
      }))
    )
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Double-entry validation failed' },
      { status: 422 }
    )
  }

  // Mark all as Posted
  const { count } = await prisma.glEntry.updateMany({
    where: { OR: orCondition, dataSource: 'Manual', glStatus: 'Draft' },
    data: { glStatus: 'Posted' },
  })

  return NextResponse.json({
    data: { posted: count, uids },
  } as ApiResponse<unknown>)
}
