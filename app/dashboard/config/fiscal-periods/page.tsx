'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { App, Button, Card, InputNumber, Select, Typography } from 'antd'
import { useT } from '@/lib/i18n/LocaleContext'
import { groupPeriodRecords } from '@/lib/utils/period'
import type { FiscalPeriodRecord, PeriodGroupRow, PeriodStatus } from '@/lib/types'
import PeriodTable from './components/PeriodTable'
import InitializeModal from './components/InitializeModal'

const { Text } = Typography

export default function FiscalPeriodsPage() {
  const t = useT()
  const { message } = App.useApp()

  // ── Filter state ──
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [companyFilter, setCompanyFilter] = useState<string>('all')
  const [companies, setCompanies] = useState<{ value: string; label: string }[]>([])

  // ── Table data state ──
  const [rows, setRows] = useState<PeriodGroupRow[]>([])
  const [loading, setLoading] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  // ── Modal state ──
  const [modalOpen, setModalOpen] = useState(false)

  // ── Fetch companies (once) ──
  useEffect(() => {
    fetch('/api/companies')
      .then((r) => r.json())
      .then((res) => {
        setCompanies(
          (res.data ?? []).map((c: { id: string; name: string }) => ({
            value: c.id,
            label: c.name,
          }))
        )
      })
      .catch(() => {})
  }, [])

  // ── Fetch periods ──
  const fetchPeriods = useCallback(
    async (y: number) => {
      setLoading(true)
      try {
        const res = await fetch(`/api/periods?year=${y}`)
        const json = await res.json()
        if (!res.ok) throw new Error(json.error)
        setRows(groupPeriodRecords(json.data ?? []))
      } catch {
        message.error(t('fiscalPeriods.error.fetchFailed'))
      } finally {
        setLoading(false)
      }
    },
    [message, t]
  )

  useEffect(() => {
    fetchPeriods(year)
  }, [year, fetchPeriods])

  // ── Client-side company filter ──
  const filteredRows: PeriodGroupRow[] =
    companyFilter === 'all'
      ? rows
      : rows
          .map((row) => ({
            ...row,
            companies: row.companies.filter((c) => c.companyId === companyFilter),
          }))
          .filter((row) => row.companies.length > 0)

  // ── Recompute overallStatus sau optimistic update ──
  function recomputeOverall(companies: FiscalPeriodRecord[]): PeriodGroupRow['overallStatus'] {
    const statuses = new Set(companies.map((c) => c.status))
    if (statuses.size !== 1) return 'mixed'
    const s = [...statuses][0]
    return s === 'Open' ? 'all-open' : s === 'Closed' ? 'all-closed' : 'all-pending'
  }

  // ── Toggle single company ──
  async function handleToggleSingle(record: FiscalPeriodRecord, checked: boolean) {
    const newStatus: PeriodStatus = checked ? 'Open' : 'Closed'
    setTogglingId(record.id)

    // Optimistic update
    setRows((prev) =>
      prev.map((row) => {
        const updated = row.companies.map((c) =>
          c.id === record.id ? { ...c, status: newStatus } : c
        )
        return { ...row, companies: updated, overallStatus: recomputeOverall(updated) }
      })
    )

    try {
      const res = await fetch(`/api/periods/${encodeURIComponent(record.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error()
      message.success(t('fiscalPeriods.success.statusUpdated'))
    } catch {
      message.error(t('fiscalPeriods.error.toggleFailed'))
      fetchPeriods(year) // rollback
    } finally {
      setTogglingId(null)
    }
  }

  // ── Toggle all companies in a period ──
  async function handleToggleBulk(row: PeriodGroupRow, checked: boolean) {
    const newStatus: PeriodStatus = checked ? 'Open' : 'Closed'
    setTogglingId(`bulk_${row.key}`)

    // Optimistic update
    setRows((prev) =>
      prev.map((r) => {
        if (r.key !== row.key) return r
        const updated = r.companies.map((c) => ({ ...c, status: newStatus }))
        return { ...r, companies: updated, overallStatus: recomputeOverall(updated) }
      })
    )

    try {
      const res = await fetch('/api/periods/bulk-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: row.year, month: row.month, status: newStatus }),
      })
      if (!res.ok) throw new Error()
      message.success(t('fiscalPeriods.success.statusUpdated'))
    } catch {
      message.error(t('fiscalPeriods.error.toggleFailed'))
      fetchPeriods(year) // rollback
    } finally {
      setTogglingId(null)
    }
  }

  // ── After initialize success ──
  function handleInitSuccess(initializedYear: number) {
    if (initializedYear === year) fetchPeriods(year)
    else setYear(initializedYear)
  }

  const companyOptions = [
    { value: 'all', label: t('fiscalPeriods.allCompanies') },
    ...companies,
  ]

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>{t('fiscalPeriods.title')}</h1>

      <Card styles={{ body: { padding: '12px 16px' } }}>
        {/* Filter row */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            marginBottom: 12,
            flexWrap: 'wrap',
          }}
        >
          <span style={{ whiteSpace: 'nowrap', fontWeight: 500 }}>
            {t('fiscalPeriods.filterCompany')}
          </span>
          <Select
            value={companyFilter}
            options={companyOptions}
            onChange={setCompanyFilter}
            style={{ width: 200 }}
            size="small"
          />
          <span style={{ whiteSpace: 'nowrap', fontWeight: 500 }}>
            {t('fiscalPeriods.filterYear')}
          </span>
          <InputNumber
            value={year}
            min={2000}
            max={2100}
            onChange={(v) => v && setYear(v)}
            style={{ width: 90 }}
            size="small"
            controls={false}
          />
          <div style={{ marginLeft: 'auto' }}>
            <Button type="primary" size="small" onClick={() => setModalOpen(true)}>
              {t('fiscalPeriods.initBtn')}
            </Button>
          </div>
        </div>

        {/* Table */}
        <PeriodTable
          rows={filteredRows}
          loading={loading}
          companyFilter={companyFilter}
          togglingId={togglingId}
          year={year}
          onToggleSingle={handleToggleSingle}
          onToggleBulk={handleToggleBulk}
        />
      </Card>

      {/* Legend */}
      <div style={{ marginTop: 8, fontSize: 12, color: '#888', lineHeight: '2' }}>
        <Text type="danger" style={{ fontSize: 12 }}>
          {t('fiscalPeriods.status.closed')}
        </Text>
        {t('fiscalPeriods.legend.closed')}
        {'  '}
        <Text type="success" style={{ fontSize: 12 }}>
          {t('fiscalPeriods.status.open')}
        </Text>
        {t('fiscalPeriods.legend.open')}
      </div>

      {/* Initialize Modal */}
      <InitializeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleInitSuccess}
      />
    </div>
  )
}
