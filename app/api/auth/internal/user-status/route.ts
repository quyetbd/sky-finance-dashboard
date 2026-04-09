// BTM Finance — Internal endpoint for middleware isActive check
// Protected by INTERNAL_API_KEY — never expose to clients

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest): Promise<NextResponse> {
  // Verify internal key
  const internalKey = req.headers.get('x-internal-key')
  if (!internalKey || internalKey !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isActive: true },
    })

    return NextResponse.json({
      data: { isActive: user?.isActive ?? false },
    })
  } catch (err) {
    console.error('[internal/user-status] DB error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
