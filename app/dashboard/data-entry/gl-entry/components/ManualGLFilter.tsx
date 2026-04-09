'use client'

import { useEffect, useState } from 'react'
import { Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import SelectDropdown from '@/app/components/SelectDropdown'
import { useT } from '@/lib/i18n/LocaleContext'
import { apiClient } from '@/lib/api-client'
import type { FiscalPeriodRecord } from '@/lib/types'
import type { ManualGLFilter as FilterValues } from '../hooks/useManualGLEntries'

interface Props {
  companies: { value: string; label: string }[]
  values: FilterValues
  loading: boolean
  onChange: (v: FilterValues) => void
  onView: () => void
}

export default function ManualGLFilter({ companies, values, loading, onChange, onView }: Props) {
  const t = useT()
  const [openPeriods, setOpenPeriods] = useState<{ value: string; label: string }[]>([])

  // Fetch open periods whenever comcode changes
  useEffect(() => {
    if (!values.comcode || values.comcode === 'all') {
      setOpenPeriods([])
      return
    }
    apiClient.get<FiscalPeriodRecord[]>(`/api/periods?status=Open&comcode=${values.comcode}`)
      .then((res) => {
        const records = res.data ?? []
        const unique = new Map<string, string>()
        for (const r of records) {
          const p = `${r.year}${String(r.month).padStart(2, '0')}`
          unique.set(p, `T${String(r.month).padStart(2, '0')}/${r.year}`)
        }
        setOpenPeriods([...unique.entries()].map(([value, label]) => ({ value, label })))
      })
      .catch(() => setOpenPeriods([]))
  }, [values.comcode])

  const companyOptions = [
    { value: 'all', label: t('manualGL.allCompanies') },
    ...companies,
  ]

  const statusOptions = [
    { value: 'all', label: t('manualGL.allStatus') },
    { value: 'Draft', label: t('manualGL.status.draft') },
    { value: 'Posted', label: t('manualGL.status.posted') },
  ]

  const periodOptions = [
    { value: '', label: t('manualGL.selectPeriod') },
    ...openPeriods,
  ]

  return (
    <div className="flex-shrink-0 flex gap-4 items-center flex-wrap">
      {/* Company */}
      <SelectDropdown
        title={t('manualGL.col.comcode')}
        value={values.comcode}
        menuItems={companyOptions.map((c) => ({ key: c.value, label: c.label }))}
        onChange={(v) => onChange({ ...values, comcode: v || 'all', period: '' })}
      />

      {/* Period — only open periods for selected company */}
      <SelectDropdown
        title={t('manualGL.col.period')}
        value={values.period || ''}
        menuItems={periodOptions.map((p) => ({ key: p.value, label: p.label }))}
        onChange={(v) => onChange({ ...values, period: v || '' })}
      />

      {/* Status */}
      <SelectDropdown
        title={t('manualGL.col.status')}
        value={values.glStatus}
        menuItems={statusOptions.map((s) => ({ key: s.value, label: s.label }))}
        onChange={(v) => onChange({ ...values, glStatus: v || 'all' })}
      />

      <Button
        type="primary"
        size="small"
        icon={<SearchOutlined />}
        onClick={onView}
        loading={loading}
        className="ml-auto"
      >
        {t('manualGL.view')}
      </Button>
    </div>
  )
}
