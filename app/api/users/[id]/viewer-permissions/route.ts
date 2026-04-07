// BTM Finance — /api/users/:id/viewer-permissions (FC only)
// GET: fetch existing permissions; PUT: replace full set

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSessionFromRequest } from '@/middleware'
import { requireRole, handleAuthError } from '@/lib/auth/guards'

interface RouteParams2 {
  params: { id: string }
}

export async function GET(req: NextRequest, { params }: RouteParams2): Promise<NextResponse> {
  try {
    const user = getSessionFromRequest(req)
    requireRole(user, ['FC'])

    const { id } = params

    const permissions = await prisma.viewerPermission.findMany({
      where: { userId: id },
      select: { comcode: true, reportKey: true },
    })

    return NextResponse.json({ data: permissions })
  } catch (err) {
    return handleAuthError(err)
  }
}

const VALID_REPORT_KEYS = [
  'profit',
  'final',
  'dispute',
  'reserve_hold',
  'by_market',
  'custom',
  'cashflow',
] as const

type ReportKey = (typeof VALID_REPORT_KEYS)[number]

interface PermissionEntry {
  comcode: string
  reportKey: string
}

interface PutPermissionsBody {
  permissions: PermissionEntry[]
}

interface RouteParams {
  params: { id: string }
}

export async function PUT(req: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const user = getSessionFromRequest(req)
    requireRole(user, ['FC'])

    const { id } = params

    let body: PutPermissionsBody
    try {
      body = await req.json() as PutPermissionsBody
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { permissions } = body

    if (!Array.isArray(permissions)) {
      return NextResponse.json(
        { error: 'permissions must be an array' },
        { status: 400 }
      )
    }

    // Validate each entry
    for (const entry of permissions) {
      if (!entry.comcode || typeof entry.comcode !== 'string') {
        return NextResponse.json(
          { error: 'Each permission must have a non-empty comcode' },
          { status: 400 }
        )
      }
      if (!VALID_REPORT_KEYS.includes(entry.reportKey as ReportKey)) {
        return NextResponse.json(
          {
            error: `Invalid reportKey '${entry.reportKey}'. Valid values: ${VALID_REPORT_KEYS.join(', ')}`,
          },
          { status: 400 }
        )
      }
    }

    // Verify target user exists and is a Viewer
    let target
    try {
      target = await prisma.user.findUnique({
        where: { id },
        select: { id: true, role: true },
      })
    } catch (err) {
      console.error('[PUT /api/users/:id/viewer-permissions] DB lookup error:', err)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    if (!target) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    if (target.role !== 'Viewer') {
      return NextResponse.json(
        { error: 'Viewer permissions can only be set for users with role Viewer' },
        { status: 400 }
      )
    }

    // Replace all permissions in a transaction
    let saved
    try {
      saved = await prisma.$transaction(async (tx) => {
        await tx.viewerPermission.deleteMany({ where: { userId: id } })

        if (permissions.length === 0) return []

        await tx.viewerPermission.createMany({
          data: permissions.map((p) => ({
            userId: id,
            comcode: p.comcode,
            reportKey: p.reportKey,
          })),
        })

        return tx.viewerPermission.findMany({ where: { userId: id } })
      })
    } catch (err) {
      console.error('[PUT /api/users/:id/viewer-permissions] DB transaction error:', err)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    return NextResponse.json({ data: saved })
  } catch (err) {
    return handleAuthError(err)
  }
}
