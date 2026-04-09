'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { App, Button, Input, Typography } from 'antd'
import { useT } from '@/lib/i18n/LocaleContext'
import type { ExchangeRateRow, FiscalPeriodRecord } from '@/lib/types'
import ExchangeRateTable from './components/ExchangeRateTable'

function nearestOpenPeriod(records: FiscalPeriodRecord[]): string | null {
  const open = records.filter((r) => r.status === 'Open')
  if (open.length === 0) return null
  const sorted = open.sort((a, b) => b.year !== a.year ? b.year - a.year : b.month - a.month)
  return `${sorted[0].year}${String(sorted[0].month).padStart(2, '0')}`
}

export default function ExchangeRatesPage() {
  const t = useT()
  const { message } = App.useApp()

  const [period, setPeriod] = useState('')
  const [rows, setRows] = useState<ExchangeRateRow[]>([])
  const [loading, setLoading] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(true)

  const fetchRates = useCallback(async (p: string) => {
    if (!p || p.length !== 6) { message.warning('Period must be 6 digits (e.g. 202501)'); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/exchange-rates?period=${p}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setRows(json.data ?? [])
      setHasLoaded(true)
    } catch {
      message.error(t('exchangeRates.error.loadFailed'))
    } finally { setLoading(false) }
  }, [message, t])

  // Auto-detect nearest open period on mount
  useEffect(() => {
    fetch('/api/periods?status=Open')
      .then((r) => r.json())
      .then((res) => {
        const nearest = nearestOpenPeriod(res.data ?? [])
        if (nearest) {
          setPeriod(nearest)
          fetchRates(nearest)
        }
      })
      .catch(() => { })
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-fontSizeHeading4 font-fontWeightStrong text-colorTextHeading">
          {t('config.exchangeRates')}
        </h1>
      </div>

      <div className="flex-1 flex flex-col gap-3 bg-white p-4 rounded-lg">
        {/* Period selector */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 500 }}>{t('exchangeRates.period')}</span>
          <Input
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            placeholder="202501"
            style={{ width: 100 }}
            size="small"
            maxLength={6}
            onPressEnter={() => fetchRates(period)}
          />
          <Button type="primary" size="small" loading={loading} onClick={() => fetchRates(period)}>
            {t('exchangeRates.view')}
          </Button>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {t('exchangeRates.viewHint')}
          </Typography.Text>
        </div>
        <Typography.Text type="secondary" style={{ fontSize: 11, marginTop: -4 }}>
          {t('exchangeRates.defaultPeriodHint')}
        </Typography.Text>

        {/* Table — shown after first View click */}
        {hasLoaded && (
          <ExchangeRateTable
            period={period}
            rows={rows}
            loading={loading}
            onRefresh={() => fetchRates(period)}
          />
        )}
      </div>
    </div>
  )
}
