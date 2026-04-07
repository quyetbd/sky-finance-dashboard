// BTM Finance — PATCH /api/users/:id/reset-password (FC only)

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSessionFromRequest } from '@/middleware'
import { requireRole, handleAuthError } from '@/lib/auth/guards'
import {
  generateTempPassword,
  hashPassword,
  sendTempPasswordEmail,
} from '@/lib/auth/password'

interface RouteParams {
  params: { id: string }
}

export async function PATCH(req: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const user = getSessionFromRequest(req)
    requireRole(user, ['FC'])

    const { id } = params

    // Fetch target user
    let target
    try {
      target = await prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true, isActive: true },
      })
    } catch (err) {
      console.error('[PATCH /api/users/:id/reset-password] DB lookup error:', err)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    if (!target) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const tempPassword = generateTempPassword()
    const passwordHash = await hashPassword(tempPassword)

    try {
      await prisma.user.update({
        where: { id },
        data: {
          passwordHash,
          mustChangePassword: true,
          failedLoginCount: 0,
          lockedUntil: null,
        },
      })
    } catch (err) {
      console.error('[PATCH /api/users/:id/reset-password] DB update error:', err)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    await sendTempPasswordEmail(target.email, tempPassword)

    return NextResponse.json({ data: { success: true } })
  } catch (err) {
    return handleAuthError(err)
  }
}
