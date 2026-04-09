'use client'

import { Table, Tag } from 'antd'
import type { ColumnsType, TableProps } from 'antd/es/table'
import { useT } from '@/lib/i18n/LocaleContext'
import type { PingPongStagingRow } from '@/lib/types'

interface Props {
  data: PingPongStagingRow[]
  loading: boolean
  selectedIds: number[]
  onSelectChange: (ids: number[]) => void
}

const fmt = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function PingPongStagingTable({
  data,
  loading,
  selectedIds,
  onSelectChange,
}: Props) {
  const t = useT()

  const columns: ColumnsType<PingPongStagingRow> = [
    {
      title: t('pingpong.col.comcode'),
      dataIndex: 'comcode',
      key: 'comcode',
      width: 100,
      fixed: 'left',
    },
    {
      title: t('pingpong.col.date'),
      dataIndex: 'date',
      key: 'date',
      width: 100,
    },
    {
      title: t('pingpong.col.journalType'),
      dataIndex: 'journalType',
      key: 'journalType',
      width: 180,
      ellipsis: true,
    },
    {
      title: t('pingpong.col.docNum'),
      dataIndex: 'docNum',
      key: 'docNum',
      width: 240,
      ellipsis: true,
      render: (v: string | null) => v ?? '—',
    },
    {
      title: t('pingpong.col.bankAccountNum'),
      dataIndex: 'bankAccountNum',
      key: 'bankAccountNum',
      width: 120,
      render: (v: string | null) => v ?? '—',
    },
    {
      title: t('pingpong.col.period'),
      dataIndex: 'period',
      key: 'period',
      width: 80,
    },
    {
      title: t('pingpong.col.currency'),
      dataIndex: 'currency',
      key: 'currency',
      width: 80,
    },
    {
      title: t('pingpong.col.amount'),
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      align: 'right',
      render: (v: number) => (
        <span style={{ color: v < 0 ? '#cf1322' : undefined }}>{fmt(v)}</span>
      ),
    },
    {
      title: t('pingpong.col.partnerCode'),
      dataIndex: 'partnerCode',
      key: 'partnerCode',
      width: 110,
      render: (v: string | null) => v ?? '—',
    },
    {
      title: t('pingpong.col.description'),
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true,
      render: (v: string | null) => v ?? '—',
    },
    {
      title: t('pingpong.col.balanceImpact'),
      dataIndex: 'balanceImpact',
      key: 'balanceImpact',
      width: 120,
      render: (v: string | null) => v ?? '—',
    },
    {
      title: t('pingpong.col.refTxnId'),
      dataIndex: 'refTxnId',
      key: 'refTxnId',
      width: 120,
      render: (v: string | null) => v ?? 'Null',
    },
    {
      title: t('pingpong.col.refNum'),
      dataIndex: 'refNum',
      key: 'refNum',
      width: 90,
      render: (v: string | null) => v ?? 'Null',
    },
    {
      title: t('pingpong.col.xrate'),
      dataIndex: 'xrate',
      key: 'xrate',
      width: 90,
      align: 'right',
      render: (v: number | null) => (v != null ? v.toFixed(2) : '—'),
    },
    {
      title: t('pingpong.col.datasource'),
      dataIndex: 'datasource',
      key: 'datasource',
      width: 90,
    },
    {
      title: t('pingpong.col.status'),
      dataIndex: 'glPosted',
      key: 'status',
      width: 130,
      fixed: 'right',
      render: (posted: boolean) =>
        posted ? (
          <Tag color="green">{t('pingpong.status.posted')}</Tag>
        ) : (
          <Tag color="default">{t('pingpong.status.unposted')}</Tag>
        ),
    },
  ]

  const rowSelection: TableProps<PingPongStagingRow>['rowSelection'] = {
    selectedRowKeys: selectedIds,
    onChange: (keys) => onSelectChange(keys as number[]),
  }

  return (
    <div className='table-report flex-1 overflow-hidden'>
      <Table<PingPongStagingRow>
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        rowSelection={rowSelection}
        pagination={false}
        size="small"
        scroll={{ x: 1900, y: 'calc(100vh - 316px)' }}
        bordered
        rowClassName={(row) => (row.glPosted ? 'opacity-50' : '')}
      />
    </div>
  )
}
