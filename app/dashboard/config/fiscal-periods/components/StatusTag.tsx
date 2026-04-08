'use client'

import { Tag } from 'antd'
import { useT } from '@/lib/i18n/LocaleContext'
import type { PeriodStatus } from '@/lib/types'

const STATUS_CONFIG: Record<PeriodStatus, { color: string; key: string }> = {
  Open:    { color: 'success', key: 'fiscalPeriods.status.open' },
  Closed:  { color: 'error',   key: 'fiscalPeriods.status.closed' },
  Pending: { color: 'default', key: 'fiscalPeriods.status.pending' },
}

interface StatusTagProps {
  status: PeriodStatus
}

export default function StatusTag({ status }: StatusTagProps) {
  const t = useT()
  const cfg = STATUS_CONFIG[status] ?? { color: 'default', key: status }
  return <Tag color={cfg.color}>{t(cfg.key)}</Tag>
}
