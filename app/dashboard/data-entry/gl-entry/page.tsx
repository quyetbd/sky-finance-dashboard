'use client'

import { useCallback, useEffect, useState } from 'react'
import { App, Button, Space } from 'antd'
import {
  CheckCircleOutlined,
  RollbackOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { useT } from '@/lib/i18n/LocaleContext'
import { apiClient } from '@/lib/api-client'
import { useManualGLEntries } from './hooks/useManualGLEntries'
import ManualGLFilter from './components/ManualGLFilter'
import ManualGLTable from './components/ManualGLTable'
import ManualGLEntryModal from './components/ManualGLEntryModal'
import type { ManualGLPair, CreateManualGLPayload } from '@/lib/types'
import type { ManualGLFilter as FilterValues } from './hooks/useManualGLEntries'

export default function ManualGLEntryPage() {
  const t = useT()
  const { message, modal } = App.useApp()

  const {
    data, loading, fetchEntries,
    createEntry, updateEntry, deleteEntry,
    postEntries, reverseEntries,
  } = useManualGLEntries()

  const [companies, setCompanies] = useState<{ value: string; label: string }[]>([])
  const [filter, setFilter] = useState<FilterValues>({
    comcode: 'all',
    period: '',
    glStatus: 'all',
  })

  const [selectedUids, setSelectedUids] = useState<string[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRow, setEditingRow] = useState<ManualGLPair | null>(null)

  // Fetch initial data
  useEffect(() => {
    fetchEntries(filter)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load companies once
  useEffect(() => {
    apiClient.get<{ id: string; name: string }[]>('/api/companies')
      .then((res) =>
        setCompanies((res.data ?? []).map((c) => ({ value: c.id, label: c.name })))
      )
      .catch(() => {})
  }, [])

  const handleView = useCallback(() => {
    setSelectedUids([])
    fetchEntries(filter)
  }, [filter, fetchEntries])

  // ─── Modal handlers ─────────────────────────────────────────────────────────

  const handleAddNew = () => {
    setEditingRow(null)
    setModalOpen(true)
  }

  const handleEdit = (row: ManualGLPair) => {
    setEditingRow(row)
    setModalOpen(true)
  }

  const handleModalSubmit = async (payload: CreateManualGLPayload, docNum?: string) => {
    try {
      if (docNum) {
        await updateEntry(docNum, payload)
      } else {
        await createEntry(payload)
      }
      message.success(t('manualGL.saveSuccess'))
      fetchEntries(filter)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t('manualGL.error.saveFailed')
      message.error(msg)
      throw e // re-throw to keep modal open
    }
  }

  // ─── Delete ──────────────────────────────────────────────────────────────────

  const handleDelete = async (docNum: string, comcode: string) => {
    try {
      await deleteEntry(docNum, comcode)
      message.success(t('manualGL.deleteSuccess'))
      setSelectedUids((prev) => prev.filter((u) => u !== `${comcode}_${docNum}`))
      fetchEntries(filter)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t('manualGL.error.deleteFailed')
      message.error(msg)
    }
  }

  // ─── Post ────────────────────────────────────────────────────────────────────

  const handlePost = () => {
    if (selectedUids.length === 0) {
      message.warning(t('manualGL.error.selectToPost'))
      return
    }

    const hasDraftOnly = selectedUids.every(
      (uid) => data.find((r) => `${r.comcode}_${r.docNum}` === uid)?.glStatus === 'Draft'
    )
    if (!hasDraftOnly) {
      message.warning(t('manualGL.error.onlyDraftPost'))
      return
    }

    modal.confirm({
      title: t('manualGL.confirmPost'),
      content: t('manualGL.confirmPostDesc'),
      okText: t('manualGL.post'),
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const count = await postEntries(selectedUids)
          message.success(t('manualGL.postSuccess').replace('{count}', String(count)))
          setSelectedUids([])
          fetchEntries(filter)
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : t('manualGL.error.postFailed')
          message.error(msg)
        }
      },
    })
  }

  // ─── Reverse ─────────────────────────────────────────────────────────────────

  const handleReverse = () => {
    if (selectedUids.length === 0) {
      message.warning(t('manualGL.error.selectToReverse'))
      return
    }

    const hasPostedOnly = selectedUids.every(
      (uid) => data.find((r) => `${r.comcode}_${r.docNum}` === uid)?.glStatus === 'Posted'
    )
    if (!hasPostedOnly) {
      message.warning(t('manualGL.error.onlyPostedReverse'))
      return
    }

    modal.confirm({
      title: t('manualGL.confirmReverse'),
      content: t('manualGL.confirmReverseDesc'),
      okText: t('manualGL.reverse'),
      okButtonProps: { danger: true },
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await reverseEntries(selectedUids)
          message.success(t('manualGL.reverseSuccess'))
          setSelectedUids([])
          fetchEntries(filter)
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : t('manualGL.error.reverseFailed')
          message.error(msg)
        }
      },
    })
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-fontSizeHeading4 font-fontWeightStrong text-colorTextHeading m-0">
          {t('manualGL.title')}
        </h1>
        <Space>
          <Button
            icon={<CheckCircleOutlined />}
            type="primary"
            onClick={handlePost}
            disabled={selectedUids.length === 0}
          >
            {t('manualGL.post')}
            {selectedUids.length > 0 ? ` (${selectedUids.length})` : ''}
          </Button>
          <Button
            icon={<RollbackOutlined />}
            danger
            onClick={handleReverse}
            disabled={selectedUids.length === 0}
          >
            {t('manualGL.reverse')}
          </Button>
          <Button
            icon={<PlusOutlined />}
            onClick={handleAddNew}
          >
            {t('manualGL.addNew')}
          </Button>
        </Space>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-3 overflow-y-hidden bg-white p-4 rounded-lg">
        <ManualGLFilter
          companies={companies}
          values={filter}
          loading={loading}
          onChange={setFilter}
          onView={handleView}
        />

        <ManualGLTable
          data={data}
          loading={loading}
          selectedUids={selectedUids}
          onSelectChange={setSelectedUids}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal */}
      <ManualGLEntryModal
        open={modalOpen}
        editingRow={editingRow}
        companies={companies}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  )
}
