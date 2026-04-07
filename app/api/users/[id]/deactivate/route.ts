// BTM Finance — PATCH /api/users/:id/deactivate (FC only)

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSessionFromRequest } from '@/middleware'
import { requireRole, handleAuthError } from '@/lib/auth/guards'

interface RouteParams {
  params: { id: string }
}

export async function PATCH(req: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const user = getSessionFromRequest(req)
    requireRole(user, ['FC'])

    const { id } = params

    // Prevent self-deactivation
    if (user.id === id) {
      return NextResponse.json(
        { error: 'You cannot deactivate your own account' },
        { status: 400 }
      )
    }

    // Fetch target user
    let target
    try {
      target = await prisma.user.findUnique({
        where: { id },
        select: { id: true, role: true, isActive: true },
      })
    } catch (err) {
      console.error('[PATCH /api/users/:id/deactivate] DB lookup error:', err)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    if (!target) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!target.isActive) {
      return NextResponse.json(
        { error: 'User is already inactive' },
        { status: 400 }
      )
    }

    // Guard: cannot deactivate the last active FC
    if (target.role === 'FC') {
      let activeFCCount
      try {
        activeFCCount = await prisma.user.count({
          where: { role: 'FC', isActive: true },
        })
      } catch (err) {
        console.error('[PATCH /api/users/:id/deactivate] FC count error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
      }

      if (activeFCCount <= 1) {
        return NextResponse.json(
          {
            error:
              'Cannot deactivate the last active FC account. ' +
              'Assign another active FC first.',
          },
          { status: 400 }
        )
      }
    }

    // Deactivate
    try {
      await prisma.user.update({
        where: { id },
        data: { isActive: false },
      })
    } catch (err) {
      console.error('[PATCH /api/users/:id/deactivate] DB update error:', err)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    // Session revocation: the middleware's isActive check (via /api/auth/internal/user-status)
    // will detect isActive = false on the next request and clear the cookie automatically.

    return NextResponse.json({ data: { success: true } })
  } catch (err) {
    return handleAuthError(err)
  }
}
