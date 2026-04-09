import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { assertPeriodOpen } from '@/lib/utils/period'
import { generateGlIds } from '@/lib/gl-engine/id-generator'
import type { ApiResponse } from '@/lib/types'

// POST /api/gl/reverse
// Body: { uids: string[], reversalDate?: string }
// Creates counter-entries (Dr↔Cr swapped) for each Posted manual uid
export async function POST(req: NextRequest) {
  const body = await req.json() as { uids: string[]; reversalDate?: string }
  const { uids, reversalDate } = body

  if (!Array.isArray(uids) || uids.length === 0) {
    return NextResponse.json({ error: 'uids array is required' }, { status: 400 })
  }

  const orCondition = uids.map(uid => {
    const [comcode, docNum] = uid.split('_')
    return { comcode, docNum }
  })

  // Fetch original lines
  const origLines = await prisma.glEntry.findMany({
    where: { OR: orCondition, dataSource: 'Manual' },
  })

  if (origLines.length === 0) {
    return NextResponse.json({ error: 'No Manual GL entries found' }, { status: 404 })
  }

  // All must be Posted
  const notPosted = origLines.filter((l) => l.glStatus !== 'Posted').map((l) => l.docNum)
  if (notPosted.length > 0) {
    return NextResponse.json(
      { error: `These docNums are not Posted yet: ${Array.from(new Set(notPosted)).join(', ')}` },
      { status: 422 }
    )
  }

  // Already reversed check
  const alreadyReversed = origLines.filter((l) => l.isReversal).map((l) => l.docNum)
  if (alreadyReversed.length > 0) {
    return NextResponse.json(
      { error: `These docNums are already reversal entries: ${Array.from(new Set(alreadyReversed)).join(', ')}` },
      { status: 422 }
    )
  }

  // Period open check (use original period — reversals go in same period)
  const combos = Array.from(new Map(origLines.map((l) => [`${l.comcode}|${l.period}`, l])).values())
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

  // Group by docNum to generate one new reversal docNum per original docNum
  const byDocNum = new Map<string, typeof origLines>()
  for (const line of origLines) {
    const key = `${line.comcode}_${line.docNum}`
    const arr = byDocNum.get(key) ?? []
    arr.push(line)
    byDocNum.set(key, arr)
  }

  const reversalDate_ = reversalDate ? new Date(reversalDate) : new Date()
  const newEntries: NonNullable<Parameters<typeof prisma.glEntry.createMany>[0]>['data'] = []
  const reversalDocNums: string[] = []

  const promises: Promise<void>[] = []
  byDocNum.forEach((lines, origDocNum) => {
    promises.push((async () => {
      const period = lines[0].period
      const comcode = lines[0].comcode

      // Generate reversal docNum using the same sequence
      const seqName = `doc_manual_${comcode}_${period}`
      await prisma.$executeRawUnsafe(`
        CREATE SEQUENCE IF NOT EXISTS "${seqName}"
        START WITH 1 INCREMENT BY 1 NO MAXVALUE NO CYCLE
      `)
      const result = await prisma.$queryRawUnsafe<Array<{ nextval: bigint }>>(
        `SELECT nextval('"${seqName}"')`
      )
      const seq = String(result[0].nextval).padStart(6, '0')
      const reversalDocNum = `${period}${seq}`
      reversalDocNums.push(reversalDocNum)

      // Generate GL IDs for reversal lines
      const glIds = await generateGlIds(prisma, period, lines.length)

      lines.forEach((orig: any, i: number) => {
        newEntries.push({
          id: glIds[i],
          comcode: orig.comcode,
          dataSource: 'Manual',
          journalType: orig.journalType,
          docNum: reversalDocNum,
          period: orig.period,
          transDate: reversalDate_,
          docDate: reversalDate_,
          inputCurr: orig.inputCurr,
          fncCurr: orig.fncCurr,
          accountCode: orig.accountCode,
          // Swap Dr ↔ Cr
          inputDr: orig.inputCr,
          inputCr: orig.inputDr,
          accountedDr: orig.accountedCr,
          accountedCr: orig.accountedDr,
          xRate: orig.xRate,
          rateType: orig.rateType,
          partner: orig.partner,
          description: `[Reversal of ${origDocNum}] ${orig.description ?? ''}`.trim(),
          balanceImpact: orig.balanceImpact,
          referenceTxnId: orig.referenceTxnId,
          refNum: orig.refNum,
          isReversal: true,
          reversedId: orig.id,
          partnerTaxId: orig.partnerTaxId,
          segment: orig.segment,
          glStatus: 'Posted', // Reversals are immediately Posted
          createdBy: 'system',
        })
      })
    })())
  })
  
  await Promise.all(promises)

  await prisma.glEntry.createMany({ data: newEntries })

  return NextResponse.json({
    data: { reversalDocNums, count: newEntries.length },
  } as ApiResponse<unknown>)
}
