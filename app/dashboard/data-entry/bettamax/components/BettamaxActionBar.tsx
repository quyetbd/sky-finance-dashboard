'use client'

import { Button, Space } from 'antd'
import {
  CheckCircleOutlined,
  RollbackOutlined,
  UnorderedListOutlined,
  UploadOutlined,
  BarChartOutlined,
} from '@ant-design/icons'
import SelectDropdown from '@/app/components/SelectDropdown'
import { useT } from '@/lib/i18n/LocaleContext'
import type { BettamaxFilter } from '@/lib/types'

interface Props {
  filter: BettamaxFilter
  companies: { value: string; label: string }[]
  periods: { value: string; label: string }[]
  loading: boolean
  selectedCount: number
  onChange: (f: BettamaxFilter) => void
  onView: () => void
  onPost: () => void
  onUnpost: () => void
  onUpload: () => void
  onSummary: () => void
}

export default function BettamaxActionBar({
  filter,
  companies,
  periods,
  loading,
  selectedCount,
  onChange,
  onView,
  onPost,
  onUnpost,
  onUpload,
  onSummary,
}: Props) {
  const t = useT()

  const companyOptions = [
    { key: 'all', label: t('bettamax.allCompanies') },
    ...companies.map((c) => ({ key: c.value, label: c.label })),
  ]

  const periodOptions = [
    { key: '', label: t('bettamax.selectPeriod') },
    ...periods.map((p) => ({ key: p.value, label: p.label })),
  ]

  const statusOptions = [
    { key: 'all', label: t('bettamax.status.all') },
    { key: 'posted', label: t('bettamax.status.posted') },
    { key: 'unposted', label: t('bettamax.status.unposted') },
  ]

  return (
    <div className="flex-shrink-0 flex gap-3 items-center flex-wrap">
      {/* Filters */}
      <SelectDropdown
        title={t('bettamax.col.comcode')}
        value={filter.comcode}
        menuItems={companyOptions}
        onChange={(v) => onChange({ ...filter, comcode: v || 'all', period: '' })}
      />

      <SelectDropdown
        title={t('bettamax.col.period')}
        value={filter.period}
        menuItems={periodOptions}
        onChange={(v) => onChange({ ...filter, period: v || '' })}
      />

      <SelectDropdown
        title={t('bettamax.col.status')}
        value={filter.status}
        menuItems={statusOptions}
        onChange={(v) => onChange({ ...filter, status: (v || 'all') as BettamaxFilter['status'] })}
      />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Action buttons */}
      <Space size="small" wrap>
        <Button size="medium" icon={<UnorderedListOutlined />} onClick={onView} loading={loading}>
          {t('bettamax.view')}
        </Button>

        <Button size="medium" icon={<BarChartOutlined />} onClick={onSummary}>
          {t('bettamax.summary')}
        </Button>

        <Button
          size="medium"
          type="primary"
          icon={<CheckCircleOutlined />}
          onClick={onPost}
          disabled={selectedCount === 0}
        >
          {t('bettamax.post')}
          {selectedCount > 0 ? ` (${selectedCount})` : ''}
        </Button>

        <Button
          size="medium"
          danger
          icon={<RollbackOutlined />}
          onClick={onUnpost}
          disabled={selectedCount === 0}
        >
          {t('bettamax.unpost')}
        </Button>

        <Button size="medium" icon={<UploadOutlined />} type="dashed" onClick={onUpload}>
          {t('bettamax.upload')}
        </Button>
      </Space>
    </div>
  )
}
