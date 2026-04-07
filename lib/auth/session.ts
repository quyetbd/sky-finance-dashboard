// BTM Finance — Session helper: reads BTMUser from middleware-injected headers

import { BTMUser, Role } from './types'
import { UnauthenticatedError } from './guards'

/**
 * Extracts the authenticated user from request headers injected by middleware.
 * Throws UnauthenticatedError if headers are missing (middleware not applied).
 */
export function getSessionFromRequest(req: Request): BTMUser {
  const id = req.headers.get('x-user-id')
  const email = req.headers.get('x-user-email') ?? ''
  const role = req.headers.get('x-user-role')
  const comcodesRaw = req.headers.get('x-user-comcodes')
  const mustChange = req.headers.get('x-user-must-change-password')

  if (!id || !role || !comcodesRaw) {
    throw new UnauthenticatedError('Missing auth context — middleware not applied')
  }

  let allowedComcodes: string[]
  try {
    allowedComcodes = JSON.parse(comcodesRaw) as string[]
  } catch {
    throw new UnauthenticatedError('Malformed comcodes header')
  }

  return {
    id,
    email,
    role: role as Role,
    allowedComcodes,
    mustChangePassword: mustChange === 'true',
  }
}
