'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { App } from 'antd'
import { useT } from '@/lib/i18n/LocaleContext'
import type { CompanyRow } from '@/lib/types'
import CompaniesTable from './components/CompaniesTable'

export default function CompaniesPage() {
  const t = useT()
  const { message } = App.useApp()

  const [rows, setRows] = useState<CompanyRow[]>([])
  const [loading, setLoading] = useState(false)

  const fetchCompanies = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/companies')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setRows(json.data ?? [])
    } catch {
      message.error(t('companies.error.loadFailed'))
    } finally { setLoading(false) }
  }, [message, t])

  useEffect(() => { fetchCompanies() }, [fetchCompanies])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-fontSizeHeading4 font-fontWeightStrong text-colorTextHeading">
          {t('config.companies')}
        </h1>
      </div>

      <div className="flex-1 flex flex-col gap-3 bg-white p-4 rounded-lg">
        <CompaniesTable rows={rows} loading={loading} onRefresh={fetchCompanies} />
      </div>
    </div>
  )
}
