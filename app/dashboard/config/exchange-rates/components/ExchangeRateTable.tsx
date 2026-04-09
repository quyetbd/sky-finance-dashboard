'use client'

import React, { useState } from 'react'
import { App, DatePicker, Input, Select, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs, { type Dayjs } from 'dayjs'
import { useT } from '@/lib/i18n/LocaleContext'
import type { ExchangeRateRow, RateType } from '@/lib/types'
import ActionLinks from '@/app/dashboard/config/components/ActionLinks'

const RATE_TYPE_OPTIONS = [
  { value: 'Mul', label: 'Mul' },
  { value: 'Div', label: 'Div' },
]

type RowDraft = {
  date: Dayjs | null
  fncCurr: string
  inputCurr: string
  rateType: RateType
  rate: string
}

// Sentinel id for the "new" row
const NEW_ROW_ID = -1

type ExtRow = ExchangeRateRow & { _isNew?: true }

function lastDayOfPeriod(period: string): Dayjs {
  const year = parseInt(period.slice(0, 4), 10)
  const month = parseInt(period.slice(4, 6), 10)
  return dayjs(new Date(year, month, 0))
}

function defaultDraft(period: string): RowDraft {
  return { date: lastDayOfPeriod(period), fncCurr: 'USD', inputCurr: '', rateType: 'Div', rate: '' }
}

type Props = {
  period: string
  rows: ExchangeRateRow[]
  loading: boolean
  onRefresh: () => void
}

export default function ExchangeRateTable({ period, rows, loading, onRefresh }: Props) {
  const t = useT()
  const { message, modal } = App.useApp()

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editDraft, setEditDraft] = useState<RowDraft | null>(null)
  const [hasNewRow, setHasNewRow] = useState(false)
  const [newDraft, setNewDraft] = useState<RowDraft>(() => defaultDraft(period))
  const [mutating, setMutating] = useState(false)

  function startEdit(row: ExchangeRateRow) {
    setEditingId(row.id)
    setEditDraft({ date: dayjs(row.date), fncCurr: row.fncCurr, inputCurr: row.inputCurr, rateType: row.rateType, rate: row.rate })
  }

  function cancelEdit() { setEditingId(null); setEditDraft(null) }

  function openNewRow() { setHasNewRow(true); setNewDraft(defaultDraft(period)) }
  function cancelNew() { setHasNewRow(false) }

  async function handleSaveNew() {
    if (!newDraft.date || !newDraft.fncCurr || !newDraft.inputCurr || !newDraft.rate) {
      message.warning(t('exchangeRates.error.requiredFields')); return
    }
    setMutating(true)
    try {
      const res = await fetch('/api/exchange-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period, date: newDraft.date.format('YYYY-MM-DD'), fncCurr: newDraft.fncCurr, inputCurr: newDraft.inputCurr, rateType: newDraft.rateType, rate: newDraft.rate }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      message.success(t('exchangeRates.saveSuccess'))
      setHasNewRow(false)
      onRefresh()
    } catch (e: unknown) {
      message.error(e instanceof Error ? e.message : t('exchangeRates.error.saveFailed'))
    } finally { setMutating(false) }
  }

  async function handleSaveEdit(id: number) {
    if (!editDraft?.date || !editDraft.fncCurr || !editDraft.inputCurr || !editDraft.rate) {
      message.warning(t('exchangeRates.error.requiredFields')); return
    }
    setMutating(true)
    try {
      const res = await fetch(`/api/exchange-rates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: editDraft.date.format('YYYY-MM-DD'), fncCurr: editDraft.fncCurr, inputCurr: editDraft.inputCurr, rateType: editDraft.rateType, rate: editDraft.rate }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      message.success(t('exchangeRates.saveSuccess'))
      cancelEdit()
      onRefresh()
    } catch (e: unknown) {
      message.error(e instanceof Error ? e.message : t('exchangeRates.error.saveFailed'))
    } finally { setMutating(false) }
  }

  function handleDelete(id: number) {
    modal.confirm({
      title: t('exchangeRates.deleteConfirm'),
      okType: 'danger',
      okText: t('exchangeRates.delete'),
      onOk: async () => {
        try {
          const res = await fetch(`/api/exchange-rates/${id}`, { method: 'DELETE' })
          const json = await res.json()
          if (!res.ok) throw new Error(json.error)
          message.success(t('exchangeRates.deleteSuccess'))
          onRefresh()
        } catch (e: unknown) {
          message.error(e instanceof Error ? e.message : t('exchangeRates.error.deleteFailed'))
        }
      },
    })
  }

  // ── Column helpers ──
  function patchNew(patch: Partial<RowDraft>) { setNewDraft((p) => ({ ...p, ...patch })) }
  function patchEdit(patch: Partial<RowDraft>) { setEditDraft((p) => (p ? { ...p, ...patch } : p)) }

  const columns: ColumnsType<ExtRow> = [
    {
      title: t('exchangeRates.col.period'),
      dataIndex: 'period',
      width: 80,
    },
    {
      title: t('exchangeRates.col.date'),
      dataIndex: 'date',
      width: 130,
      render: (val: string, record) => {
        const isEditing = record._isNew || editingId === record.id
        const draft = record._isNew ? newDraft : editDraft
        if (isEditing && draft) {
          return (
            <DatePicker size="small" value={draft.date} format="M/D/YYYY" style={{ width: 118 }}
              onChange={(d: Dayjs | null) => record._isNew ? patchNew({ date: d }) : patchEdit({ date: d })} />
          )
        }
        return val ? dayjs(val).format('M/D/YYYY') : ''
      },
    },
    {
      title: <div><div>{t('exchangeRates.col.fncCurr')}</div><div style={{ fontSize: 11, fontWeight: 400, color: '#888' }}>{t('exchangeRates.col.fncCurrLabel')}</div></div>,
      dataIndex: 'fncCurr',
      width: 140,
      render: (val: string, record) => {
        const isEditing = record._isNew || editingId === record.id
        const draft = record._isNew ? newDraft : editDraft
        if (isEditing && draft) {
          return (
            <Input size="small" value={draft.fncCurr} style={{ width: 80 }}
              onChange={(e) => { const v = e.target.value.toUpperCase(); record._isNew ? patchNew({ fncCurr: v }) : patchEdit({ fncCurr: v }) }} />
          )
        }
        return val
      },
    },
    {
      title: <div><div>{t('exchangeRates.col.inputCurr')}</div><div style={{ fontSize: 11, fontWeight: 400, color: '#888' }}>{t('exchangeRates.col.inputCurrLabel')}</div></div>,
      dataIndex: 'inputCurr',
      width: 140,
      render: (val: string, record) => {
        const isEditing = record._isNew || editingId === record.id
        const draft = record._isNew ? newDraft : editDraft
        if (isEditing && draft) {
          return (
            <Input size="small" value={draft.inputCurr} style={{ width: 80 }}
              onChange={(e) => { const v = e.target.value.toUpperCase(); record._isNew ? patchNew({ inputCurr: v }) : patchEdit({ inputCurr: v }) }} />
          )
        }
        return val
      },
    },
    {
      title: t('exchangeRates.col.rateType'),
      dataIndex: 'rateType',
      width: 90,
      render: (val: string, record) => {
        const isEditing = record._isNew || editingId === record.id
        const draft = record._isNew ? newDraft : editDraft
        if (isEditing && draft) {
          return (
            <Select size="small" value={draft.rateType} options={RATE_TYPE_OPTIONS} style={{ width: 78 }}
              onChange={(v: RateType) => record._isNew ? patchNew({ rateType: v }) : patchEdit({ rateType: v })} />
          )
        }
        return val
      },
    },
    {
      title: t('exchangeRates.col.rate'),
      dataIndex: 'rate',
      width: 120,
      align: 'right',
      render: (val: string, record) => {
        const isEditing = record._isNew || editingId === record.id
        const draft = record._isNew ? newDraft : editDraft
        if (isEditing && draft) {
          return (
            <Input size="small" value={draft.rate} style={{ width: 100, textAlign: 'right' }}
              onChange={(e) => record._isNew ? patchNew({ rate: e.target.value }) : patchEdit({ rate: e.target.value })} />
          )
        }
        return val ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(Number(val)) : ''
      },
    },
    {
      title: t('exchangeRates.col.action'),
      width: 110,
      render: (_, record) => {
        if (record._isNew) {
          return <ActionLinks primary={{ label: t('exchangeRates.save'), onClick: handleSaveNew }} secondary={{ label: t('exchangeRates.delete'), onClick: cancelNew, muted: true }} />
        }
        if (editingId === record.id) {
          return <ActionLinks primary={{ label: t('exchangeRates.save'), onClick: () => handleSaveEdit(record.id) }} secondary={{ label: t('exchangeRates.cancel'), onClick: cancelEdit, muted: true }} />
        }
        return <ActionLinks primary={{ label: t('exchangeRates.edit'), onClick: () => startEdit(record) }} secondary={{ label: t('exchangeRates.delete'), onClick: () => handleDelete(record.id), danger: true }} />
      },
    },
  ]

  const newRowRecord: ExtRow = { id: NEW_ROW_ID, period, date: '', fncCurr: '', inputCurr: '', rateType: 'Div', rate: '', _isNew: true }
  const dataSource: ExtRow[] = [...rows, ...(hasNewRow ? [newRowRecord] : [])]

  return (
    <Table
      size="small"
      rowKey={(r) => r.id}
      columns={columns}
      dataSource={dataSource}
      loading={loading || mutating}
      pagination={false}
      footer={() =>
        !hasNewRow ? (
          <Typography.Link onClick={openNewRow}>{t('exchangeRates.addNew')}</Typography.Link>
        ) : null
      }
    />
  )
}

