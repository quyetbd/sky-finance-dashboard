'use client'

import React, { useState } from 'react'
import { Button, Select, Typography } from 'antd'
import { useT } from '@/lib/i18n/LocaleContext'
import { JOURNAL_TYPE_DATASOURCES, type JournalTypeRuleRow } from '@/lib/types'
import { MOCK_JOURNAL_TYPE_RULES } from './mock'
import JournalTypesTable from './components/JournalTypesTable'

const DS_OPTIONS = JOURNAL_TYPE_DATASOURCES.map((v) => ({ value: v, label: v }))

export default function JournalTypesPage() {
  const t = useT()

  const [selectedDs, setSelectedDs] = useState<string | null>(null)
  const [visibleRows, setVisibleRows] = useState<JournalTypeRuleRow[]>(MOCK_JOURNAL_TYPE_RULES)

  function handleView() {
    if (selectedDs) {
      setVisibleRows(MOCK_JOURNAL_TYPE_RULES.filter((r) => r.dataSource === selectedDs))
    } else {
      setVisibleRows(MOCK_JOURNAL_TYPE_RULES)
    }
  }

  function handleClearDs() {
    setSelectedDs(null)
    setVisibleRows(MOCK_JOURNAL_TYPE_RULES)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-fontSizeHeading4 font-fontWeightStrong text-colorTextHeading">
          {t('config.journalTypes')}
        </h1>
      </div>

      {/* Filter card */}
      <div className="bg-white p-4 rounded-lg flex flex-col gap-3">
        {/* Hint banner */}
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {t('journalTypes.addHint')}
        </Typography.Text>

        {/* Filter row */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{t('journalTypes.col.dataSource')}</span>
              <Select
                allowClear
                placeholder={t('journalTypes.dataSourcePlaceholder')}
                options={DS_OPTIONS}
                value={selectedDs}
                style={{ width: 180 }}
                onChange={(v: string | undefined) => {
                  if (v === undefined) {
                    handleClearDs()
                  } else {
                    setSelectedDs(v)
                  }
                }}
                onClear={handleClearDs}
              />
              <Button type="primary" size="middle" onClick={handleView}>
                {t('journalTypes.view')}
              </Button>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {t('journalTypes.viewHint')}
              </Typography.Text>
            </div>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {t('journalTypes.dataSourceHint')}
            </Typography.Text>
          </div>
        </div>

        {/* Table */}
        <JournalTypesTable rows={visibleRows} />
      </div>
    </div>
  )
}
