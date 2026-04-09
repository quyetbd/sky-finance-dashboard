'use client'

import { Button, Space } from 'antd'
import {
  CheckCircleOutlined,
  RollbackOutlined,
  SyncOutlined,
  UploadOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import SelectDropdown from '@/app/components/SelectDropdown'
import { useT } from '@/lib/i18n/LocaleContext'
import type { PaypalFilter } from '@/lib/types'

interface Props {
  filter: PaypalFilter
  companies: { value: string; label: string }[]
  periods: { value: string; label: string }[]
  loading: boolean
  selectedCount: number
  onChange: (f: PaypalFilter) => void
  onView: () => void
  onPost: () => void
  onUnpost: () => void
  onSync: () => void
  onUpload: () => void
  onSummary: () => void
}

export default function PaypalActionBar({
  filter,
  companies,
  periods,
  loading,
  selectedCount,
  onChange,
  onView,
  onPost,
  onUnpost,
  onSync,
  onUpload,
  onSummary,
}: Props) {
  const t = useT()

  const companyOptions = [
    { key: 'all', label: t('paypal.allCompanies') },
    ...companies.map((c) => ({ key: c.value, label: c.label })),
  ]

  const periodOptions = [
    { key: '', label: t('paypal.selectPeriod') },
    ...periods.map((p) => ({ key: p.value, label: p.label })),
  ]

  const statusOptions = [
    { key: 'all', label: t('paypal.status.all') },
    { key: 'posted', label: t('paypal.status.posted') },
    { key: 'unposted', label: t('paypal.status.unposted') },
  ]

  return (
    <div className="flex-shrink-0 flex gap-3 items-center flex-wrap">
      {/* Filters */}
      <SelectDropdown
        title={t('paypal.col.comcode')}
        value={filter.comcode}
        menuItems={companyOptions}
        onChange={(v) => onChange({ ...filter, comcode: v || 'all', period: '' })}
      />

      <SelectDropdown
        title={t('paypal.col.period')}
        value={filter.period}
        menuItems={periodOptions}
        onChange={(v) => onChange({ ...filter, period: v || '' })}
      />

      <SelectDropdown
        title={t('paypal.col.status')}
        value={filter.status}
        menuItems={statusOptions}
        onChange={(v) => onChange({ ...filter, status: (v || 'all') as PaypalFilter['status'] })}
      />

      {/* Divider space */}
      <div className="flex-1" />

      {/* Action buttons */}
      <Space size="small" wrap>
        <Button size="small" icon={<UnorderedListOutlined />} onClick={onView} loading={loading}>
          {t('paypal.view')}
        </Button>

        <Button size="small" onClick={onSummary}>
          {t('paypal.summary')}
        </Button>

        <Button
          size="small"
          type="primary"
          icon={<CheckCircleOutlined />}
          onClick={onPost}
          disabled={selectedCount === 0}
        >
          {t('paypal.post')}
          {selectedCount > 0 ? ` (${selectedCount})` : ''}
        </Button>

        <Button
          size="small"
          danger
          icon={<RollbackOutlined />}
          onClick={onUnpost}
          disabled={selectedCount === 0}
        >
          {t('paypal.unpost')}
        </Button>

        <Button size="small" icon={<SyncOutlined />} onClick={onSync}>
          {t('paypal.sync')}
        </Button>

        <Button size="small" icon={<UploadOutlined />} type="dashed" onClick={onUpload}>
          {t('paypal.upload')}
        </Button>
      </Space>
    </div>
  )
}
