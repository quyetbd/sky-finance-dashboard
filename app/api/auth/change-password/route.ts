// BTM Finance — POST /api/auth/change-password
// Accessible by any authenticated user (including mustChangePassword = true).
// NOTE: This route sits under /api/auth/* so middleware intentionally skips it
// (to allow users with mustChangePassword = true to reach here). We therefore
// read identity directly from the JWT instead of middleware-injected headers.

import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import prisma from '@/lib/prisma'
import {
  verifyPassword,
  hashPassword,
  validatePasswordStrength,
} from '@/lib/auth/password'
import { handleAuthError } from '@/lib/auth/guards'

interface ChangePasswordBody {
  currentPassword: string
  newPassword: string
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Read JWT directly — middleware does not run on /api/auth/* routes
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = token.id as string

    let body: ChangePasswordBody
    try {
      body = await req.json() as ChangePasswordBody
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'currentPassword and newPassword are required' },
        { status: 400 }
      )
    }

    // Validate new password strength
    const strengthError = validatePasswordStrength(newPassword)
    if (strengthError) {
      return NextResponse.json({ error: strengthError }, { status: 400 })
    }

    // Fetch current hash from DB
    let dbUser
    try {
      dbUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, passwordHash: true },
      })
    } catch (err) {
      console.error('[change-password] DB lookup error:', err)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, dbUser.passwordHash)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    // Hash and save
    const newHash = await hashPassword(newPassword)
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newHash, mustChangePassword: false },
      })
    } catch (err) {
      console.error('[change-password] DB update error:', err)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    // requireSessionUpdate: true tells the client to call useSession().update()
    // so the JWT cookie is refreshed with mustChangePassword = false
    return NextResponse.json({ data: { success: true, requireSessionUpdate: true } })
  } catch (err) {
    return handleAuthError(err)
  }
}
