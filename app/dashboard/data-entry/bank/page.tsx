'use client'

import { useCallback, useMemo, useState } from 'react'
import { App } from 'antd'
import { useT } from '@/lib/i18n/LocaleContext'
import type { BankFilter, BankStagingRow } from '@/lib/types'
import type { RcFile } from 'antd/es/upload'
import { MOCK_BANK_TRANSACTIONS } from './mock'
import BankActionBar from './components/BankActionBar'
import BankStagingTable from './components/BankStagingTable'
import DataEntryUploadModal from '../components/DataEntryUploadModal'

// Mock companies — replace with API fetch when wiring real data
const COMPANIES = [
  { value: 'ZeniroxPay', label: 'ZeniroxPay' },
  { value: 'Ontario', label: 'Ontario' },
  { value: 'Vicbea', label: 'Vicbea' },
  { value: 'MessiPay', label: 'MessiPay' },
]

// Derive period options from mock data (production: fetch open fiscal periods from API)
function derivePeriods(rows: BankStagingRow[]) {
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

export default function DataEntryBankPage() {
  const t = useT()
  const { message, modal } = App.useApp()

  const [filter, setFilter] = useState<BankFilter>({
    comcode: 'all',
    period: '',
    status: 'all',
  })
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [uploadOpen, setUploadOpen] = useState(false)
  const [loading] = useState(false)

  // Filtered data (client-side for mock; will be server-side with real API)
  const data = useMemo(() => {
    return MOCK_BANK_TRANSACTIONS.filter((row) => {
      if (filter.comcode !== 'all' && row.comcode !== filter.comcode) return false
      if (filter.period && row.period !== filter.period) return false
      if (filter.status === 'posted' && !row.glPosted) return false
      if (filter.status === 'unposted' && row.glPosted) return false
      return true
    })
  }, [filter])

  const periods = useMemo(() => derivePeriods(MOCK_BANK_TRANSACTIONS), [])

  const handleView = useCallback(() => {
    setSelectedIds([])
    // TODO: replace with real fetch when API is ready
  }, [])

  // ── Post to GL ────────────────────────────────────────────────────────────

  const handlePost = () => {
    if (selectedIds.length === 0) {
      message.warning(t('bank.selectToPost'))
      return
    }

    const allUnposted = selectedIds.every(
      (id) => data.find((r) => r.id === id)?.glPosted === false
    )
    if (!allUnposted) {
      message.warning(t('bank.onlyUnpostedPost'))
      return
    }

    modal.confirm({
      title: t('bank.confirmPost'),
      content: t('bank.confirmPostDesc'),
      okText: t('bank.post'),
      cancelText: 'Hủy',
      onOk: async () => {
        // TODO: call POST /api/bank/post when API is ready
        message.success(
          t('bank.postSuccess').replace('{count}', String(selectedIds.length))
        )
        setSelectedIds([])
      },
    })
  }

  // ── Unpost ────────────────────────────────────────────────────────────────

  const handleUnpost = () => {
    if (selectedIds.length === 0) {
      message.warning(t('bank.selectToUnpost'))
      return
    }

    const allPosted = selectedIds.every(
      (id) => data.find((r) => r.id === id)?.glPosted === true
    )
    if (!allPosted) {
      message.warning(t('bank.onlyPostedUnpost'))
      return
    }

    modal.confirm({
      title: t('bank.confirmUnpost'),
      content: t('bank.confirmUnpostDesc'),
      okText: t('bank.unpost'),
      okButtonProps: { danger: true },
      cancelText: 'Hủy',
      onOk: async () => {
        // TODO: call DELETE /api/bank/post when API is ready
        message.success(
          t('bank.unpostSuccess').replace('{count}', String(selectedIds.length))
        )
        setSelectedIds([])
      },
    })
  }

  // ── Upload ────────────────────────────────────────────────────────────────

  const handleUploadSuccess = async (comcode: string, period: string, _file: RcFile) => {
    // TODO: POST /api/bank with FormData when API is ready
    message.success(
      t('bank.uploadSuccess').replace('{inserted}', '0').replace('{duplicates}', '0')
    )
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
        {t('bank.title')}
      </h1>

      {/* Content card */}
      <div className="flex-1 flex flex-col gap-3 overflow-y-hidden bg-white p-4 rounded-lg">
        <BankActionBar
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

        <BankStagingTable
          data={data}
          loading={loading}
          selectedIds={selectedIds}
          onSelectChange={setSelectedIds}
        />
      </div>

      {/* Upload modal */}
      <DataEntryUploadModal
        open={uploadOpen}
        title={t('bank.uploadFile')}
        fileAccept=".xlsx,.xls"
        fileLabel="File Excel"
        fileHint={t('bank.uploadHint')}
        fileSubhint="Bank Statement (.xlsx)"
        fileTypeError={t('bank.uploadFileType')}
        companies={COMPANIES}
        periods={periods}
        onClose={() => setUploadOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  )
}
