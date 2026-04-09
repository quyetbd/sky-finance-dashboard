'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { App, Button } from 'antd'
import { useSession } from 'next-auth/react'
import { useT } from '@/lib/i18n/LocaleContext'
import type { ChartOfAccountRow } from '@/lib/types'
import CoaTable from './components/CoaTable'

export default function ChartOfAccountsPage() {
  const t = useT()
  const { message } = App.useApp()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'FC'

  const [rows,       setRows]       = useState<ChartOfAccountRow[]>([])
  const [loading,    setLoading]    = useState(false)
  const [showNewRow, setShowNewRow] = useState(false)

  const fetchAccounts = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/chart-of-accounts')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setRows(json.data ?? [])
    } catch {
      message.error(t('chartOfAccounts.error.loadFailed'))
    } finally { setLoading(false) }
  }, [message, t])

  useEffect(() => { fetchAccounts() }, [fetchAccounts])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-fontSizeHeading4 font-fontWeightStrong text-colorTextHeading">
          {t('config.chartOfAccounts')}
        </h1>
        {isAdmin && !showNewRow && (
          <Button type="primary" onClick={() => setShowNewRow(true)}>
            {t('chartOfAccounts.addNew')}
          </Button>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-3 bg-white p-4 rounded-lg overflow-y-hidden">
        <CoaTable
          rows={rows}
          loading={loading}
          isAdmin={isAdmin}
          showNewRow={showNewRow}
          onCancelNew={() => setShowNewRow(false)}
          onRefresh={fetchAccounts}
        />
      </div>
    </div>
  )
}
