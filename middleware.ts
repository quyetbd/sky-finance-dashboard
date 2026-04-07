// BTM Finance — Global middleware
// Protects /dashboard/* and /api/* (except /api/auth/*)
//
// isActive check: Prisma cannot run on Edge runtime, so we call an internal
// lightweight endpoint (/api/auth/internal/user-status) that runs on Node.js.
// That endpoint is under /api/auth/* so it is excluded from this middleware,
// preventing infinite recursion.

import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { BTMUser, Role } from '@/lib/auth/types'

const CHANGE_PASSWORD_PAGE = '/change-password'
const CHANGE_PASSWORD_API = '/api/auth/change-password'

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl

  // ── Skip NextAuth endpoints (login, callback, internal checks) ──────────────
  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }

  // ── 1. Verify JWT session ────────────────────────────────────────────────────
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ── 2. Check isActive via internal API (Node.js runtime, reads from DB) ──────
  try {
    const checkUrl = new URL('/api/auth/internal/user-status', req.nextUrl.origin)
    checkUrl.searchParams.set('userId', token.id as string)

    const checkRes = await fetch(checkUrl.toString(), {
      headers: { 'x-internal-key': process.env.INTERNAL_API_KEY ?? '' },
    })

    if (checkRes.ok) {
      const body = await checkRes.json() as { data?: { isActive: boolean } }
      const isActive = body.data?.isActive ?? true

      if (!isActive) {
        const res = pathname.startsWith('/api/')
          ? NextResponse.json({ error: 'Account deactivated' }, { status: 401 })
          : NextResponse.redirect(new URL('/login', req.url))

        // Clear session cookies
        res.cookies.delete('next-auth.session-token')
        res.cookies.delete('__Secure-next-auth.session-token')
        return res
      }
    }
  } catch (err) {
    // Fail-open: allow the request if the status check itself fails.
    // This prevents a single DB hiccup from locking all users out.
    console.error('[Middleware] isActive check failed:', err)
  }

  // ── 3. Enforce password change ───────────────────────────────────────────────
  const mustChange = token.mustChangePassword as boolean | undefined
  const isChangePasswordRoute =
    pathname === CHANGE_PASSWORD_PAGE || pathname === CHANGE_PASSWORD_API

  if (mustChange && !isChangePasswordRoute) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Password change required before accessing the system' },
        { status: 403 }
      )
    }
    return NextResponse.redirect(new URL(CHANGE_PASSWORD_PAGE, req.url))
  }

  // ── 4. Inject user context into request headers ──────────────────────────────
  const headers = new Headers(req.headers)
  headers.set('x-user-id', token.id as string)
  headers.set('x-user-email', (token.email as string) ?? '')
  headers.set('x-user-role', token.role as string)
  headers.set('x-user-comcodes', JSON.stringify(token.allowedComcodes ?? []))
  headers.set('x-user-must-change-password', String(mustChange ?? false))

  return NextResponse.next({ request: { headers } })
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
}

/**
 * Reads the authenticated BTMUser from middleware-injected headers.
 * Use this in every route handler instead of calling getServerSession().
 */
export function getSessionFromRequest(req: Request): BTMUser {
  const id = req.headers.get('x-user-id')
  const email = req.headers.get('x-user-email') ?? ''
  const role = req.headers.get('x-user-role')
  const comcodesRaw = req.headers.get('x-user-comcodes')
  const mustChange = req.headers.get('x-user-must-change-password')

  if (!id || !role || !comcodesRaw) {
    // Should never happen if middleware is correctly configured
    throw new Error('Auth headers missing — middleware not applied to this route')
  }

  return {
    id,
    email,
    role: role as Role,
    allowedComcodes: JSON.parse(comcodesRaw) as string[],
    mustChangePassword: mustChange === 'true',
  }
}
