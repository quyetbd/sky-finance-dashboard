'use client'

import { useCallback, useMemo, useState } from 'react'
import { App } from 'antd'
import { useT } from '@/lib/i18n/LocaleContext'
import type { PaypalFilter, PaypalStagingRow } from '@/lib/types'
import type { RcFile } from 'antd/es/upload'
import { MOCK_PAYPAL_TRANSACTIONS } from './mock'
import PaypalActionBar from './components/PaypalActionBar'
import PaypalStagingTable from './components/PaypalStagingTable'
import PaypalUploadModal from './components/PaypalUploadModal'

// Mock companies — replace with API fetch when wiring real data
const COMPANIES = [
  { value: 'ZeniroxPay', label: 'ZeniroxPay' },
  { value: 'Ontario', label: 'Ontario' },
  { value: 'Vicbea', label: 'Vicbea' },
  { value: 'MessiPay', label: 'MessiPay' },
]

// Derive period options from mock data
function derivePeriods(rows: PaypalStagingRow[]) {
  const unique = new Map<string, string>()
  for (const r of rows) {
    if (!unique.has(r.period)) {
      const y = r.period.slice(0, 4)
      const m = r.period.slice(4, 6)
      unique.set(r.period, `T${m}/${y}`)
    }
  }
  return [...unique.entries()].map(([value, label]) => ({ value, label }))
}

export default function PaypalPage() {
  const t = useT()
  const { message, modal } = App.useApp()

  const [filter, setFilter] = useState<PaypalFilter>({
    comcode: 'all',
    period: '',
    status: 'all',
  })
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [uploadOpen, setUploadOpen] = useState(false)
  const [loading] = useState(false)

  // Filtered data (client-side for mock; will be server-side with real API)
  const data = useMemo(() => {
    return MOCK_PAYPAL_TRANSACTIONS.filter((row) => {
      if (filter.comcode !== 'all' && row.comcode !== filter.comcode) return false
      if (filter.period && row.period !== filter.period) return false
      if (filter.status === 'posted' && !row.glPosted) return false
      if (filter.status === 'unposted' && row.glPosted) return false
      return true
    })
  }, [filter])

  const periods = useMemo(() => derivePeriods(MOCK_PAYPAL_TRANSACTIONS), [])

  const handleView = useCallback(() => {
    setSelectedIds([])
    // TODO: replace with real fetch when API is ready
  }, [])

  // ── Post to GL ────────────────────────────────────────────────────────────

  const handlePost = () => {
    if (selectedIds.length === 0) {
      message.warning(t('paypal.selectToPost'))
      return
    }

    const allUnposted = selectedIds.every(
      (id) => data.find((r) => r.id === id)?.glPosted === false
    )
    if (!allUnposted) {
      message.warning(t('paypal.onlyUnpostedPost'))
      return
    }

    modal.confirm({
      title: t('paypal.confirmPost'),
      content: t('paypal.confirmPostDesc'),
      okText: t('paypal.post'),
      cancelText: 'Hủy',
      onOk: async () => {
        // TODO: call POST /api/paypal/post when API is ready
        message.success(
          t('paypal.postSuccess').replace('{count}', String(selectedIds.length))
        )
        setSelectedIds([])
      },
    })
  }

  // ── Unpost ────────────────────────────────────────────────────────────────

  const handleUnpost = () => {
    if (selectedIds.length === 0) {
      message.warning(t('paypal.selectToUnpost'))
      return
    }

    const allPosted = selectedIds.every(
      (id) => data.find((r) => r.id === id)?.glPosted === true
    )
    if (!allPosted) {
      message.warning(t('paypal.onlyPostedUnpost'))
      return
    }

    modal.confirm({
      title: t('paypal.confirmUnpost'),
      content: t('paypal.confirmUnpostDesc'),
      okText: t('paypal.unpost'),
      okButtonProps: { danger: true },
      cancelText: 'Hủy',
      onOk: async () => {
        // TODO: call DELETE /api/paypal/post when API is ready
        message.success(
          t('paypal.unpostSuccess').replace('{count}', String(selectedIds.length))
        )
        setSelectedIds([])
      },
    })
  }

  // ── Upload ────────────────────────────────────────────────────────────────

  const handleUploadSuccess = async (comcode: string, period: string, _file: RcFile) => {
    // TODO: POST /api/paypal with FormData when API is ready
    message.success(
      t('paypal.uploadSuccess')
        .replace('{inserted}', '0')
        .replace('{duplicates}', '0')
    )
    void comcode  // will be used when wiring API
    void period
  }

  // ── Sync ──────────────────────────────────────────────────────────────────

  const handleSync = () => {
    message.info('Sync — coming soon')
  }

  const handleSummary = () => {
    message.info('Summary — coming soon')
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <h1 className="text-fontSizeHeading4 font-fontWeightStrong text-colorTextHeading m-0">
        {t('paypal.title')}
      </h1>

      {/* Content card */}
      <div className="flex-1 flex flex-col gap-3 overflow-y-hidden bg-white p-4 rounded-lg">
        <PaypalActionBar
          filter={filter}
          companies={COMPANIES}
          periods={periods}
          loading={loading}
          selectedCount={selectedIds.length}
          onChange={setFilter}
          onView={handleView}
          onPost={handlePost}
          onUnpost={handleUnpost}
          onSync={handleSync}
          onUpload={() => setUploadOpen(true)}
          onSummary={handleSummary}
        />

        <PaypalStagingTable
          data={data}
          loading={loading}
          selectedIds={selectedIds}
          onSelectChange={setSelectedIds}
        />
      </div>

      {/* Upload modal */}
      <PaypalUploadModal
        open={uploadOpen}
        companies={COMPANIES}
        periods={periods}
        onClose={() => setUploadOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  )
}
