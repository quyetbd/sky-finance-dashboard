'use client'

import { useCallback, useMemo, useState } from 'react'
import { App } from 'antd'
import { useT } from '@/lib/i18n/LocaleContext'
import type { BettamaxFilter, BettamaxStagingRow } from '@/lib/types'
import type { RcFile } from 'antd/es/upload'
import { MOCK_BETTAMAX_TRANSACTIONS } from './mock'
import BettamaxActionBar from './components/BettamaxActionBar'
import BettamaxStagingTable from './components/BettamaxStagingTable'
import BettamaxUploadModal from './components/BettamaxUploadModal'

const COMPANIES = [
  { value: 'ZeniroxPay', label: 'ZeniroxPay' },
  { value: 'Ontario', label: 'Ontario' },
  { value: 'Vicbea', label: 'Vicbea' },
  { value: 'MessiPay', label: 'MessiPay' },
]

function derivePeriods(rows: BettamaxStagingRow[]) {
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

export default function DataEntryBettamaxPage() {
  const t = useT()
  const { message, modal } = App.useApp()

  const [filter, setFilter] = useState<BettamaxFilter>({
    comcode: 'all',
    period: '',
    status: 'all',
  })
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [uploadOpen, setUploadOpen] = useState(false)
  const [loading] = useState(false)

  const data = useMemo(() => {
    return MOCK_BETTAMAX_TRANSACTIONS.filter((row) => {
      if (filter.comcode !== 'all' && row.comcode !== filter.comcode) return false
      if (filter.period && row.period !== filter.period) return false
      if (filter.status === 'posted' && !row.glPosted) return false
      if (filter.status === 'unposted' && row.glPosted) return false
      return true
    })
  }, [filter])

  const periods = useMemo(() => derivePeriods(MOCK_BETTAMAX_TRANSACTIONS), [])

  const handleView = useCallback(() => {
    setSelectedIds([])
    // TODO: replace with real fetch when API is ready
  }, [])

  // ── Post to GL ────────────────────────────────────────────────────────────

  const handlePost = () => {
    if (selectedIds.length === 0) {
      message.warning(t('bettamax.selectToPost'))
      return
    }

    const allUnposted = selectedIds.every(
      (id) => data.find((r) => r.id === id)?.glPosted === false
    )
    if (!allUnposted) {
      message.warning(t('bettamax.onlyUnpostedPost'))
      return
    }

    modal.confirm({
      title: t('bettamax.confirmPost'),
      content: t('bettamax.confirmPostDesc'),
      okText: t('bettamax.post'),
      cancelText: 'Hủy',
      onOk: async () => {
        // TODO: call POST /api/bettamax/post when API is ready
        message.success(
          t('bettamax.postSuccess').replace('{count}', String(selectedIds.length))
        )
        setSelectedIds([])
      },
    })
  }

  // ── Unpost ────────────────────────────────────────────────────────────────

  const handleUnpost = () => {
    if (selectedIds.length === 0) {
      message.warning(t('bettamax.selectToUnpost'))
      return
    }

    const allPosted = selectedIds.every(
      (id) => data.find((r) => r.id === id)?.glPosted === true
    )
    if (!allPosted) {
      message.warning(t('bettamax.onlyPostedUnpost'))
      return
    }

    modal.confirm({
      title: t('bettamax.confirmUnpost'),
      content: t('bettamax.confirmUnpostDesc'),
      okText: t('bettamax.unpost'),
      okButtonProps: { danger: true },
      cancelText: 'Hủy',
      onOk: async () => {
        // TODO: call DELETE /api/bettamax/post when API is ready
        message.success(
          t('bettamax.unpostSuccess').replace('{count}', String(selectedIds.length))
        )
        setSelectedIds([])
      },
    })
  }

  // ── Upload ────────────────────────────────────────────────────────────────

  const handleUploadSuccess = async (comcode: string, period: string, _file: RcFile) => {
    // TODO: POST /api/bettamax with FormData when API is ready
    message.success(t('bettamax.uploadSuccess'))
    void comcode
    void period
    void _file
  }

  const handleSummary = () => {
    message.info('Summary — coming soon')
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <h1 className="text-fontSizeHeading4 font-fontWeightStrong text-colorTextHeading m-0">
        {t('dataEntry.bettamax')}
      </h1>

      {/* Content card */}
      <div className="flex-1 flex flex-col gap-3 overflow-y-hidden bg-white p-4 rounded-lg">
        <BettamaxActionBar
          filter={filter}
          companies={COMPANIES}
          periods={periods}
          loading={loading}
          selectedCount={selectedIds.length}
          onChange={setFilter}
          onView={handleView}
          onPost={handlePost}
          onUnpost={handleUnpost}
          onUpload={() => setUploadOpen(true)}
          onSummary={handleSummary}
        />

        <BettamaxStagingTable
          data={data}
          loading={loading}
          selectedIds={selectedIds}
          onSelectChange={setSelectedIds}
        />
      </div>

      {/* Upload modal */}
      <BettamaxUploadModal
        open={uploadOpen}
        companies={COMPANIES}
        periods={periods}
        onClose={() => setUploadOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  )
}
