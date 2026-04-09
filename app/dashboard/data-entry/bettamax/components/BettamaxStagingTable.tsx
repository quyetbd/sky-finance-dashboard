'use client'

import { Table, Tag } from 'antd'
import type { ColumnsType, TableProps } from 'antd/es/table'
import { useT } from '@/lib/i18n/LocaleContext'
import type { BettamaxStagingRow } from '@/lib/types'

interface Props {
  data: BettamaxStagingRow[]
  loading: boolean
  selectedIds: number[]
  onSelectChange: (ids: number[]) => void
}

const fmt = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function BettamaxStagingTable({ data, loading, selectedIds, onSelectChange }: Props) {
  const t = useT()

  const columns: ColumnsType<BettamaxStagingRow> = [
    {
      title: t('bettamax.col.comcode'),
      dataIndex: 'comcode',
      key: 'comcode',
      width: 110,
      fixed: 'left',
    },
    {
      title: t('bettamax.col.transdate'),
      dataIndex: 'transdate',
      key: 'transdate',
      width: 100,
    },
    {
      title: t('bettamax.col.journalType'),
      dataIndex: 'journalType',
      key: 'journalType',
      width: 140,
      ellipsis: true,
    },
    {
      title: t('bettamax.col.docNum'),
      dataIndex: 'docNum',
      key: 'docNum',
      width: 240,
      ellipsis: true,
      render: (v: string | null) => v ?? '—',
    },
    {
      title: t('bettamax.col.period'),
      dataIndex: 'period',
      key: 'period',
      width: 80,
    },
    {
      title: t('bettamax.col.currency'),
      dataIndex: 'currency',
      key: 'currency',
      width: 80,
    },
    {
      title: t('bettamax.col.amount'),
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      align: 'right',
      render: (v: number) => (
        <span style={{ color: v < 0 ? '#cf1322' : undefined }}>{fmt(v)}</span>
      ),
    },
    {
      title: t('bettamax.col.xrate'),
      dataIndex: 'xrate',
      key: 'xrate',
      width: 80,
      align: 'right',
      render: (v: number | null) => (v != null ? v.toFixed(4) : '—'),
    },
    {
      title: t('bettamax.col.partnerCode'),
      dataIndex: 'partnerCode',
      key: 'partnerCode',
      width: 110,
      render: (v: string | null) => v ?? '—',
    },
    {
      title: t('bettamax.col.datasource'),
      dataIndex: 'datasource',
      key: 'datasource',
      width: 90,
    },
    {
      title: t('bettamax.col.status'),
      dataIndex: 'glPosted',
      key: 'status',
      width: 120,
      fixed: 'right',
      render: (posted: boolean) =>
        posted ? (
          <Tag color="green">{t('bettamax.status.posted')}</Tag>
        ) : (
          <Tag color="default">{t('bettamax.status.unposted')}</Tag>
        ),
    },
  ]

  const rowSelection: TableProps<BettamaxStagingRow>['rowSelection'] = {
    selectedRowKeys: selectedIds,
    onChange: (keys) => onSelectChange(keys as number[]),
  }

  return (
    <div style={{ flex: 1, overflow: 'hidden' }}>
      <Table<BettamaxStagingRow>
        className="report-table"
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        rowSelection={rowSelection}
        pagination={false}
        size="small"
        scroll={{ x: 1300, y: 'calc(100vh - 280px)' }}
        bordered
        rowClassName={(row) => (row.glPosted ? 'opacity-50' : '')}
      />
    </div>
  )
}
