'use client'

import { SessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'
import { LocaleProvider } from '@/lib/i18n/LocaleContext'
import { AntdConfigProvider } from './AntdConfigProvider'

export function Providers({
  session,
  children,
}: {
  session:  Session | null
  children: React.ReactNode
}) {
  return (
    <SessionProvider session={session}>
      <LocaleProvider>
        <AntdConfigProvider>
          {children}
        </AntdConfigProvider>
      </LocaleProvider>
    </SessionProvider>
  )
}
