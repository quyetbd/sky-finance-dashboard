/**
 * Comcode Authorization Middleware
 *
 * Validate rằng user có quyền truy cập vào comcode được request
 * Mọi query phải filter `WHERE comcode IN (user.allowedComcodes)`
 */

import { NextRequest, NextResponse } from 'next/server'

/**
 * Check if user is allowed to access comcode
 *
 * TODO: Implement after NextAuth setup
 * For now, placeholder
 */
export async function checkComcodeAccess(
  req: NextRequest,
  requestedComcode: string
): Promise<void> {
  // TODO: Extract user từ session
  // TODO: Verify user.allowedComcodes includes requestedComcode
  // Nếu không: throw ForbiddenError
}

/**
 * Filter comcodes by user access
 *
 * TODO: Implement after NextAuth setup
 */
export async function getUserAllowedComcodes(req: NextRequest): Promise<string[]> {
  // TODO: Extract user từ session
  // TODO: Return user.allowedComcodes
  return [] // Placeholder
}
