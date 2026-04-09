'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { App, Button } from 'antd'
import { ExportOutlined } from '@ant-design/icons'
import { useT } from '@/lib/i18n/LocaleContext'
import GLViewerFilter, { type GLFilterValues } from './components/GLViewerFilter'
import GLViewerTable from './components/GLViewerTable'
import { apiClient } from '@/lib/api-client'

export type GLViewerRow = {
  id: string
  comcode: string
  dataSource: string
  journalType: string
  docNum: string
  referenceTxnId: string | null
  bankAccountNum: string | null
  accountCode: number
  partner: string | null
  period: string
  refNum: string | null
  transDate: string
  docDate: string
  inputCurr: string
  fncCurr: string
  inputDr: number
  inputCr: number
  xRate: number
  rateType: string
  accountedDr: number
  accountedCr: number
  description: string | null
  balanceImpact: string | null
  isReversal: boolean
  reversedId: string | null
  partnerTaxId: string | null
  segment: string | null
  createdAt: string
  createdBy: string
}

function exportToCSV(data: GLViewerRow[]) {
  const headers = [
    'ID', 'Comcode', 'DataSource', 'JournalType', 'DocNum',
    'ReferenceTxnId', 'BankAccountNum', 'AccountCode', 'Partner',
    'Period', 'RefNum', 'TransDate', 'DocDate', 'InputCurr', 'FncCurr',
    'InputDr', 'InputCr', 'XRate', 'RateType', 'AccountedDr', 'AccountedCr',
    'Description', 'BalanceImpact', 'IsReversal', 'ReversedId',
    'PartnerTaxId', 'Segment',
  ]

  const rows = data.map((r) =>
    [
      r.id, r.comcode, r.dataSource, r.journalType, r.docNum,
      r.referenceTxnId ?? '', r.bankAccountNum ?? '', r.accountCode, r.partner ?? '',
      r.period, r.refNum ?? '', r.transDate, r.docDate, r.inputCurr, r.fncCurr,
      r.inputDr, r.inputCr, r.xRate, r.rateType, r.accountedDr, r.accountedCr,
      `"${(r.description ?? '').replace(/"/g, '""')}"`,
      r.balanceImpact ?? '', r.isReversal ? 'true' : 'false',
      r.reversedId ?? '', r.partnerTaxId ?? '', r.segment ?? '',
    ].join(',')
  )

  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `GL_export_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function GLViewerPage() {
  const t = useT()
  const { message } = App.useApp()

  const [companies, setCompanies] = useState<{ value: string; label: string }[]>([])

  useEffect(() => {
    apiClient.get<{ id: string; name: string }[]>('/api/companies')
      .then((res) => {
        setCompanies(
          (res.data ?? []).map((c) => ({
            value: c.id,
            label: c.name,
          }))
        )
      })
      .catch(() => {})
  }, [])

  const [filter, setFilter] = useState<GLFilterValues>({
    comcode: 'all',
    fromDate: null,
    toDate: null,
    dataSource: 'all',
  })

  const [data, setData] = useState<GLViewerRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(100)
  const [loading, setLoading] = useState(false)
  const [hasQueried, setHasQueried] = useState(false)

  const fetchData = useCallback(
    async (f: GLFilterValues, pg: number, ps: number) => {
      setLoading(true)
      setHasQueried(true)
      try {
        const params = new URLSearchParams({ comcode: f.comcode, page: String(pg), pageSize: String(ps) })
        if (f.fromDate) params.set('fromDate', f.fromDate)
        if (f.toDate) params.set('toDate', f.toDate)
        if (f.dataSource && f.dataSource !== 'all') params.set('dataSource', f.dataSource)

        const res = await apiClient.get<GLViewerRow[]>(`/api/gl?${params.toString()}`)
        const rows: GLViewerRow[] = res.data ?? []
        setData(rows)
        setTotal(res.meta?.total ?? rows.length)
      } catch {
        message.error('Failed to load GL entries')
      } finally {
        setLoading(false)
      }
    },
    [message]
  )

  // Initial fetch
  useEffect(() => {
    if (!hasQueried) {
      fetchData(filter, page, pageSize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleView = () => {
    setPage(1)
    fetchData(filter, 1, pageSize)
  }

  const handlePageChange = (pg: number, ps: number) => {
    setPage(pg)
    setPageSize(ps)
    if (hasQueried) fetchData(filter, pg, ps)
  }

  const handleExport = () => {
    exportToCSV(data)
    message.success(t('glViewer.exportSuccess'))
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-fontSizeHeading4 font-fontWeightStrong text-colorTextHeading m-0">
          {t('glViewer.title')}
        </h1>
        <Button icon={<ExportOutlined />} onClick={handleExport}>
          {t('common.export')}
        </Button>
      </div>

      <div className="flex-1 flex flex-col gap-3 overflow-y-hidden bg-white p-4 rounded-lg">
        <GLViewerFilter
          companies={companies}
          values={filter}
          loading={loading}
          onChange={setFilter}
          onView={handleView}
        />

        <GLViewerTable
          data={data}
          loading={loading}
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}
