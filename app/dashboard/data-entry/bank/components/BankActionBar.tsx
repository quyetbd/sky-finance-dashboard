'use client'

import { Button, Space } from 'antd'
import {
  CheckCircleOutlined,
  RollbackOutlined,
  UploadOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import SelectDropdown from '@/app/components/SelectDropdown'
import { useT } from '@/lib/i18n/LocaleContext'
import type { BankFilter } from '@/lib/types'

interface Props {
  filter: BankFilter
  companies: { value: string; label: string }[]
  periods: { value: string; label: string }[]
  loading: boolean
  selectedCount: number
  onChange: (f: BankFilter) => void
  onView: () => void
  onPost: () => void
  onUnpost: () => void
  onUpload: () => void
  onSummary: () => void
}

export default function BankActionBar({
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
    { key: 'all', label: t('bank.allCompanies') },
    ...companies.map((c) => ({ key: c.value, label: c.label })),
  ]

  const periodOptions = [
    { key: '', label: t('bank.selectPeriod') },
    ...periods.map((p) => ({ key: p.value, label: p.label })),
  ]

  const statusOptions = [
    { key: 'all', label: t('bank.status.all') },
    { key: 'posted', label: t('bank.status.posted') },
    { key: 'unposted', label: t('bank.status.unposted') },
  ]

  return (
    <div className="flex-shrink-0 flex gap-3 items-center flex-wrap">
      {/* Filters */}
      <SelectDropdown
        title={t('bank.col.comcode')}
        value={filter.comcode}
        menuItems={companyOptions}
        onChange={(v) => onChange({ ...filter, comcode: v || 'all', period: '' })}
      />

      <SelectDropdown
        title={t('bank.col.period')}
        value={filter.period}
        menuItems={periodOptions}
        onChange={(v) => onChange({ ...filter, period: v || '' })}
      />

      <SelectDropdown
        title={t('bank.col.status')}
        value={filter.status}
        menuItems={statusOptions}
        onChange={(v) => onChange({ ...filter, status: (v || 'all') as BankFilter['status'] })}
      />

      <div className="flex-1" />

      {/* Action buttons */}
      <Space size="small" wrap>
        <Button size="small" icon={<UnorderedListOutlined />} onClick={onView} loading={loading}>
          {t('bank.view')}
        </Button>

        <Button size="small" onClick={onSummary}>
          {t('bank.summary')}
        </Button>

        <Button
          size="small"
          type="primary"
          icon={<CheckCircleOutlined />}
          onClick={onPost}
          disabled={selectedCount === 0}
        >
          {t('bank.post')}
          {selectedCount > 0 ? ` (${selectedCount})` : ''}
        </Button>

        <Button
          size="small"
          danger
          icon={<RollbackOutlined />}
          onClick={onUnpost}
          disabled={selectedCount === 0}
        >
          {t('bank.unpost')}
        </Button>

        <Button size="small" icon={<UploadOutlined />} type="dashed" onClick={onUpload}>
          {t('bank.upload')}
        </Button>
      </Space>
    </div>
  )
}
