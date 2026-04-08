'use client'

import React, { useState } from 'react'
import { App, Popconfirm, Spin, Switch, Table, Tooltip, Typography } from 'antd'
import type { TableColumnsType } from 'antd'
import { useT } from '@/lib/i18n/LocaleContext'
import StatusTag from './StatusTag'
import type { FiscalPeriodRecord, PeriodGroupRow, PeriodStatus } from '@/lib/types'

const { Text } = Typography

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function buildPeriodLabel(year: number, month: number, quarter: number, isQuarterly: boolean) {
  if (isQuarterly) return `Q${quarter}/${year}`
  return `T${String(month).padStart(2, '0')}/${year}`
}

function detectIsQuarterly(rows: PeriodGroupRow[]): boolean {
  return rows.length > 0 && rows.length <= 4 && rows.every((r) => r.month % 3 === 0)
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface PeriodTableProps {
  rows: PeriodGroupRow[]
  loading: boolean
  companyFilter: string
  togglingId: string | null
  year: number
  onToggleSingle: (record: FiscalPeriodRecord, checked: boolean) => void
  onToggleBulk: (row: PeriodGroupRow, checked: boolean) => void
}

// ─── Sub-table: companies within a period ────────────────────────────────────

function CompanySubTable({
  companies,
  companyFilter,
  togglingId,
  onToggleSingle,
}: {
  companies: FiscalPeriodRecord[]
  companyFilter: string
  togglingId: string | null
  onToggleSingle: (record: FiscalPeriodRecord, checked: boolean) => void
}) {
  const t = useT()
  const { message } = App.useApp()

  // Track which record is pending close confirmation
  const [closingId, setClosingId] = useState<string | null>(null)

  const data =
    companyFilter === 'all'
      ? companies
      : companies.filter((c) => c.companyId === companyFilter)

  const columns: TableColumnsType<FiscalPeriodRecord> = [
    {
      title: t('fiscalPeriods.col.company'),
      dataIndex: 'companyId',
      key: 'companyId',
      width: 180,
      render: (v: string) => <Text strong>{v}</Text>,
    },
    {
      title: t('fiscalPeriods.col.status'),
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (v: PeriodStatus) => <StatusTag status={v} />,
    },
    {
      title: t('fiscalPeriods.col.action'),
      key: 'action',
      width: 150,
      render: (_: unknown, record: FiscalPeriodRecord) => {
        const isOpen   = record.status === 'Open'
        const isClosed = record.status === 'Closed'

        return (
          <Tooltip title={t('fiscalPeriods.toggleHint')}>
            <Popconfirm
              title={t('fiscalPeriods.confirm.closeTitle')}
              description={t('fiscalPeriods.confirm.closeDesc')}
              open={closingId === record.id}
              okText={t('fiscalPeriods.confirm.closeOk')}
              cancelText={t('fiscalPeriods.cancel')}
              okButtonProps={{ danger: true }}
              onConfirm={() => {
                setClosingId(null)
                onToggleSingle(record, false)
              }}
              onCancel={() => setClosingId(null)}
            >
              <Switch
                size="small"
                checked={isOpen}
                checkedChildren={t('fiscalPeriods.status.open')}
                unCheckedChildren={
                  isClosed
                    ? t('fiscalPeriods.status.closed')
                    : t('fiscalPeriods.status.pending')
                }
                loading={togglingId === record.id}
                onChange={(checked) => {
                  if (!checked) {
                    // Closing: show Popconfirm, không toggle ngay
                    if (isOpen) setClosingId(record.id)
                    return
                  }
                  // Opening
                  if (isClosed) {
                    // Business rule: Closed → Open bị chặn, chỉ Admin mới được (TODO auth)
                    message.error(t('fiscalPeriods.error.reopenBlocked'))
                    return
                  }
                  // Pending → Open: OK
                  onToggleSingle(record, true)
                }}
              />
            </Popconfirm>
          </Tooltip>
        )
      },
    },
  ]

  return (
    <Table<FiscalPeriodRecord>
      dataSource={data}
      columns={columns}
      rowKey="id"
      size="small"
      pagination={false}
      showHeader
      style={{ marginLeft: 48 }}
    />
  )
}

// ─── Main Table ───────────────────────────────────────────────────────────────

export default function PeriodTable({
  rows,
  loading,
  companyFilter,
  togglingId,
  year,
  onToggleSingle,
  onToggleBulk,
}: PeriodTableProps) {
  const t = useT()
  const { message } = App.useApp()

  const isQuarterly = detectIsQuarterly(rows)

  // Track bulk close confirmation
  const [bulkClosingKey, setBulkClosingKey] = useState<string | null>(null)

  const columns: TableColumnsType<PeriodGroupRow> = [
    {
      title: t('fiscalPeriods.col.year'),
      dataIndex: 'year',
      key: 'year',
      width: 70,
      align: 'right',
    },
    {
      title: t('fiscalPeriods.col.quarter'),
      dataIndex: 'quarter',
      key: 'quarter',
      width: 60,
      align: 'center',
    },
    {
      title: t('fiscalPeriods.col.month'),
      dataIndex: 'month',
      key: 'month',
      width: 70,
      align: 'center',
      render: (v: number) => String(v).padStart(2, '0'),
    },
    {
      title: t('fiscalPeriods.col.period'),
      key: 'period',
      width: 110,
      render: (_: unknown, row: PeriodGroupRow) => (
        <Text code>
          {buildPeriodLabel(row.year, row.month, row.quarter, isQuarterly)}
        </Text>
      ),
    },
    {
      title: t('fiscalPeriods.col.startDate'),
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120,
      render: (v: string) => formatDate(v),
    },
    {
      title: t('fiscalPeriods.col.endDate'),
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
      render: (v: string) => formatDate(v),
    },
    {
      title: t('fiscalPeriods.col.note'),
      dataIndex: 'note',
      key: 'note',
      ellipsis: true,
      render: (v: string | null) => v ?? '—',
    },
    {
      title: t('fiscalPeriods.col.action'),
      key: 'action',
      width: 140,
      render: (_: unknown, row: PeriodGroupRow) => {
        const bulkKey   = row.key
        const isAllOpen = row.overallStatus === 'all-open'
        const isAllClosed = row.overallStatus === 'all-closed'
        const isMixed   = row.overallStatus === 'mixed'

        return (
          <Tooltip title={t('fiscalPeriods.toggleHintAll')}>
            <Popconfirm
              title={t('fiscalPeriods.confirm.bulkCloseTitle')}
              description={t('fiscalPeriods.confirm.bulkCloseDesc')}
              open={bulkClosingKey === bulkKey}
              okText={t('fiscalPeriods.confirm.closeOk')}
              cancelText={t('fiscalPeriods.cancel')}
              okButtonProps={{ danger: true }}
              onConfirm={() => {
                setBulkClosingKey(null)
                onToggleBulk(row, false)
              }}
              onCancel={() => setBulkClosingKey(null)}
            >
              <Switch
                checked={isAllOpen}
                checkedChildren={t('fiscalPeriods.status.open')}
                unCheckedChildren={isMixed ? '—' : t('fiscalPeriods.status.closed')}
                loading={togglingId === `bulk_${bulkKey}`}
                style={isMixed ? { backgroundColor: '#faad14' } : undefined}
                onChange={(checked) => {
                  if (!checked) {
                    // Closing: show Popconfirm nếu có ít nhất 1 Open
                    if (isAllOpen || isMixed) {
                      setBulkClosingKey(bulkKey)
                    }
                    return
                  }
                  // Opening
                  if (isAllClosed) {
                    // Business rule: không thể mở lại kỳ đã đóng toàn bộ (TODO auth)
                    message.error(t('fiscalPeriods.error.reopenBlocked'))
                    return
                  }
                  // Mixed hoặc all-pending → Open all
                  onToggleBulk(row, true)
                }}
              />
            </Popconfirm>
          </Tooltip>
        )
      },
    },
  ]

  // Empty state khi năm chưa có kỳ
  const emptyText = t('fiscalPeriods.empty').replace('{year}', String(year))

  return (
    <Spin spinning={loading}>
      <Table<PeriodGroupRow>
        dataSource={rows}
        columns={columns}
        rowKey="key"
        size="small"
        pagination={false}
        locale={{ emptyText }}
        expandable={{
          expandedRowRender: (row) => (
            <CompanySubTable
              companies={row.companies}
              companyFilter={companyFilter}
              togglingId={togglingId}
              onToggleSingle={onToggleSingle}
            />
          ),
          rowExpandable: (row) => row.companies.length > 0,
        }}
      />
    </Spin>
  )
}
