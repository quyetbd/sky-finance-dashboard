'use client'

import React, { useState } from 'react'
import { App, Input, Select, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useT } from '@/lib/i18n/LocaleContext'
import type { CompanyRow } from '@/lib/types'
import ActionLinks from '@/app/dashboard/config/components/ActionLinks'

const STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
]

type CompanyDraft = {
  id: string        // comcode — editable only for new rows
  taxId: string
  name: string
  currency: string
  status: string
  country: string
}

const NEW_ROW_KEY = '__new__'
type ExtRow = CompanyRow & { _isNew?: true }

function defaultDraft(): CompanyDraft {
  return { id: '', taxId: '', name: '', currency: 'USD', status: 'Active', country: '' }
}

type Props = {
  rows: CompanyRow[]
  loading: boolean
  onRefresh: () => void
}

export default function CompaniesTable({ rows, loading, onRefresh }: Props) {
  const t = useT()
  const { message, modal } = App.useApp()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<CompanyDraft | null>(null)
  const [hasNewRow, setHasNewRow] = useState(false)
  const [newDraft, setNewDraft] = useState<CompanyDraft>(defaultDraft)
  const [mutating, setMutating] = useState(false)

  function startEdit(row: CompanyRow) {
    setEditingId(row.id)
    setEditDraft({ id: row.id, taxId: row.taxId ?? '', name: row.name, currency: row.currency, status: row.status, country: row.country })
  }

  function cancelEdit() { setEditingId(null); setEditDraft(null) }
  function openNewRow() { setHasNewRow(true); setNewDraft(defaultDraft()) }
  function cancelNew() { setHasNewRow(false) }

  function patchNew(patch: Partial<CompanyDraft>) { setNewDraft((p) => ({ ...p, ...patch })) }
  function patchEdit(patch: Partial<CompanyDraft>) { setEditDraft((p) => (p ? { ...p, ...patch } : p)) }

  async function handleSaveNew() {
    if (!newDraft.id || !newDraft.name || !newDraft.currency || !newDraft.country) {
      message.warning(t('companies.error.requiredFields')); return
    }
    setMutating(true)
    try {
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: newDraft.id, name: newDraft.name, taxId: newDraft.taxId || null, currency: newDraft.currency, status: newDraft.status, country: newDraft.country }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      message.success(t('companies.saveSuccess'))
      setHasNewRow(false)
      onRefresh()
    } catch (e: unknown) {
      message.error(e instanceof Error ? e.message : t('companies.error.saveFailed'))
    } finally { setMutating(false) }
  }

  async function handleSaveEdit(id: string) {
    if (!editDraft?.name || !editDraft.currency || !editDraft.country) {
      message.warning(t('companies.error.requiredFields')); return
    }
    setMutating(true)
    try {
      const res = await fetch(`/api/companies/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editDraft.name, taxId: editDraft.taxId || null, currency: editDraft.currency, status: editDraft.status, country: editDraft.country }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      message.success(t('companies.saveSuccess'))
      cancelEdit()
      onRefresh()
    } catch (e: unknown) {
      message.error(e instanceof Error ? e.message : t('companies.error.saveFailed'))
    } finally { setMutating(false) }
  }

  function handleDelete(id: string) {
    modal.confirm({
      title: t('companies.deleteConfirm'),
      okType: 'danger',
      okText: t('companies.delete'),
      onOk: async () => {
        try {
          const res = await fetch(`/api/companies/${encodeURIComponent(id)}`, { method: 'DELETE' })
          const json = await res.json()
          if (!res.ok) throw new Error(json.error)
          message.success(t('companies.deleteSuccess'))
          onRefresh()
        } catch (e: unknown) {
          message.error(e instanceof Error ? e.message : t('companies.error.deleteFailed'))
        }
      },
    })
  }

  const columns: ColumnsType<ExtRow> = [
    {
      title: t('companies.col.rowNum'),
      width: 48,
      render: (_: unknown, _record: ExtRow, index: number) => (_record._isNew ? '' : index + 1),
    },
    {
      title: t('companies.col.id'),
      dataIndex: 'id',
      width: 130,
      render: (val: string, record) => {
        if (record._isNew) {
          return <Input size="small" value={newDraft.id} placeholder="ZeniroxPay" style={{ width: 120 }} onChange={(e) => patchNew({ id: e.target.value })} />
        }
        return val
      },
    },
    {
      title: t('companies.col.taxId'),
      dataIndex: 'taxId',
      width: 120,
      render: (val: string | null, record) => {
        const isEditing = record._isNew || editingId === record.id
        const draft = record._isNew ? newDraft : editDraft
        if (isEditing && draft) {
          return <Input size="small" value={draft.taxId} style={{ width: 110 }} onChange={(e) => record._isNew ? patchNew({ taxId: e.target.value }) : patchEdit({ taxId: e.target.value })} />
        }
        return val ?? ''
      },
    },
    {
      title: t('companies.col.name'),
      dataIndex: 'name',
      render: (val: string, record) => {
        const isEditing = record._isNew || editingId === record.id
        const draft = record._isNew ? newDraft : editDraft
        if (isEditing && draft) {
          return <Input size="small" value={draft.name} style={{ width: '100%', minWidth: 140 }} onChange={(e) => record._isNew ? patchNew({ name: e.target.value }) : patchEdit({ name: e.target.value })} />
        }
        return val
      },
    },
    {
      title: t('companies.col.currency'),
      dataIndex: 'currency',
      width: 90,
      render: (val: string, record) => {
        const isEditing = record._isNew || editingId === record.id
        const draft = record._isNew ? newDraft : editDraft
        if (isEditing && draft) {
          return <Input size="small" value={draft.currency} style={{ width: 70 }} onChange={(e) => { const v = e.target.value.toUpperCase(); record._isNew ? patchNew({ currency: v }) : patchEdit({ currency: v }) }} />
        }
        return val
      },
    },
    {
      title: t('companies.col.status'),
      dataIndex: 'status',
      width: 120,
      render: (val: string, record) => {
        const isEditing = record._isNew || editingId === record.id
        const draft = record._isNew ? newDraft : editDraft
        if (isEditing && draft) {
          return <Select size="small" value={draft.status} options={STATUS_OPTIONS} style={{ width: 110 }} onChange={(v: string) => record._isNew ? patchNew({ status: v }) : patchEdit({ status: v })} />
        }
        return val
      },
    },
    {
      title: t('companies.col.country'),
      dataIndex: 'country',
      width: 100,
      render: (val: string, record) => {
        const isEditing = record._isNew || editingId === record.id
        const draft = record._isNew ? newDraft : editDraft
        if (isEditing && draft) {
          return <Input size="small" value={draft.country} style={{ width: 88 }} onChange={(e) => record._isNew ? patchNew({ country: e.target.value }) : patchEdit({ country: e.target.value })} />
        }
        return val
      },
    },
    {
      title: t('companies.col.action'),
      width: 110,
      render: (_, record) => {
        if (record._isNew) {
          return <ActionLinks primary={{ label: t('companies.save'), onClick: handleSaveNew }} secondary={{ label: t('companies.delete'), onClick: cancelNew, muted: true }} />
        }
        if (editingId === record.id) {
          return <ActionLinks primary={{ label: t('companies.save'), onClick: () => handleSaveEdit(record.id) }} secondary={{ label: t('companies.cancel'), onClick: cancelEdit, muted: true }} />
        }
        return <ActionLinks primary={{ label: t('companies.edit'), onClick: () => startEdit(record) }} secondary={{ label: t('companies.delete'), onClick: () => handleDelete(record.id), danger: true }} />
      },
    },
  ]

  const newRowRecord: ExtRow = { id: NEW_ROW_KEY, name: '', taxId: null, currency: 'USD', status: 'Active', country: '', _isNew: true }
  const dataSource: ExtRow[] = [...rows, ...(hasNewRow ? [newRowRecord] : [])]

  return (
    <Table
      size="small"
      rowKey={(r) => r._isNew ? NEW_ROW_KEY : r.id}
      columns={columns}
      dataSource={dataSource}
      loading={loading || mutating}
      pagination={false}
      footer={() =>
        !hasNewRow ? (
          <Typography.Link onClick={openNewRow}>{t('companies.addNew')}</Typography.Link>
        ) : null
      }
    />
  )
}
