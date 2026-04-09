// BTM Finance — /api/users — User management (FC only)

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSessionFromRequest } from '@/middleware'
import { requireRole, handleAuthError } from '@/lib/auth/guards'

// ── GET /api/users — List all users ──────────────────────────────────────────
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const user = getSessionFromRequest(req)
    requireRole(user, ['FC'])

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        allowedComcodes: true,
        isActive: true,
        mustChangePassword: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: users })
  } catch (err) {
    return handleAuthError(err)
  }
}
import {
  generateTempPassword,
  hashPassword,
  sendTempPasswordEmail,
} from '@/lib/auth/password'
import { Role } from '@/lib/auth/types'

const VALID_ROLES: Role[] = ['FC', 'Accountant', 'Director', 'Viewer']

interface CreateUserBody {
  email: string
  role: Role
  allowedComcodes: string[]
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const user = getSessionFromRequest(req)
    requireRole(user, ['FC'])

    let body: CreateUserBody
    try {
      body = await req.json() as CreateUserBody
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { email, role, allowedComcodes } = body

    // Validate inputs
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }
    if (!role || !VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}` },
        { status: 400 }
      )
    }
    if (!allowedComcodes || allowedComcodes.length === 0) {
      return NextResponse.json(
        { error: 'allowedComcodes must not be empty' },
        { status: 400 }
      )
    }

    // Check email uniqueness
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      )
    }

    const tempPassword = generateTempPassword()
    const passwordHash = await hashPassword(tempPassword)

    let newUser
    try {
      newUser = await prisma.user.create({
        data: {
          email,
          passwordHash,
          role,
          allowedComcodes,
          mustChangePassword: true,
          isActive: true,
          createdBy: user.id,
        },
        select: {
          id: true,
          email: true,
          role: true,
          allowedComcodes: true,
          mustChangePassword: true,
          isActive: true,
          createdAt: true,
        },
      })
    } catch (err) {
      console.error('[POST /api/users] DB create error:', err)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    // Send temp password (stub logs to console)
    await sendTempPasswordEmail(email, tempPassword)

    return NextResponse.json({ data: newUser }, { status: 201 })
  } catch (err) {
    return handleAuthError(err)
  }
}
