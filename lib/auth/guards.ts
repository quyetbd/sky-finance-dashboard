// BTM Finance — Authorization Guards & Error Classes

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { BTMUser, Role } from './types'

// ─── Error Classes ────────────────────────────────────────────────────────────

export class UnauthenticatedError extends Error {
  status = 401
  constructor(message = 'Unauthorized') {
    super(message)
    this.name = 'UnauthenticatedError'
  }
}

export class ForbiddenError extends Error {
  status = 403
  constructor(message = 'Forbidden') {
    super(message)
    this.name = 'ForbiddenError'
  }
}

export class AccountLockedError extends Error {
  status = 423
  lockedUntil: Date
  constructor(lockedUntil: Date) {
    super(`Account locked until ${lockedUntil.toISOString()}`)
    this.name = 'AccountLockedError'
    this.lockedUntil = lockedUntil
  }
}

// ─── Guards ───────────────────────────────────────────────────────────────────

export function requireRole(user: BTMUser, allowed: Role[]): void {
  if (!allowed.includes(user.role)) {
    throw new ForbiddenError(
      `Role '${user.role}' is not permitted. Required: ${allowed.join(', ')}`
    )
  }
}

export function requireComcode(user: BTMUser, comcode: string): void {
  if (!user.allowedComcodes.includes(comcode)) {
    throw new ForbiddenError(`Access denied to comcode '${comcode}'`)
  }
}

export async function requireViewerPermission(
  userId: string,
  comcode: string,
  reportKey: string
): Promise<void> {
  try {
    const permission = await prisma.viewerPermission.findUnique({
      where: { userId_comcode_reportKey: { userId, comcode, reportKey } },
    })
    if (!permission) {
      throw new ForbiddenError(
        `No permission for report '${reportKey}' in comcode '${comcode}'`
      )
    }
  } catch (err) {
    if (err instanceof ForbiddenError) throw err
    console.error('[requireViewerPermission] DB error:', err)
    throw new ForbiddenError('Permission check failed')
  }
}

export async function authorizeRequest(
  user: BTMUser,
  comcode: string,
  allowedRoles: Role[]
): Promise<void> {
  requireRole(user, allowedRoles)
  requireComcode(user, comcode)
}

// ─── Response Helper ─────────────────────────────────────────────────────────

export function handleAuthError(err: unknown): NextResponse {
  if (err instanceof UnauthenticatedError) {
    return NextResponse.json({ error: err.message }, { status: 401 })
  }
  if (err instanceof ForbiddenError) {
    return NextResponse.json({ error: err.message }, { status: 403 })
  }
  if (err instanceof AccountLockedError) {
    return NextResponse.json(
      { error: err.message, lockedUntil: err.lockedUntil },
      { status: 423 }
    )
  }
  console.error('[API Error]', err)
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
}
