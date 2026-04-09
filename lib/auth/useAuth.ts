'use client'

import { useSession } from 'next-auth/react'
import type { BTMUser } from './types'

export function useAuth() {
  const { data: session, status, update } = useSession()
  const user = session?.user as BTMUser | undefined

  return {
    user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    isFC: user?.role === 'FC',
    isAccountant: user?.role === 'Accountant',
    isDirector: user?.role === 'Director',
    isViewer: user?.role === 'Viewer',
    canWrite: ['FC', 'Accountant'].includes(user?.role ?? ''),
    updateSession: update,
  }
}
