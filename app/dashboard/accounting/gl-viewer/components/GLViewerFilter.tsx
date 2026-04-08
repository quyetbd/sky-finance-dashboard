'use client'

import { Button, DatePicker } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import SelectDropdown from '@/app/components/SelectDropdown'
import dayjs, { Dayjs } from 'dayjs'
import { useT } from '@/lib/i18n/LocaleContext'

const { RangePicker } = DatePicker

const DATA_SOURCES = ['PayPal', 'Platform', 'PingPong', 'BankVN', 'BankCAN', 'Manual']

export interface GLFilterValues {
  comcode: string
  fromDate: string | null
  toDate: string | null
  dataSource: string
}

interface Props {
  companies: { value: string; label: string }[]
  values: GLFilterValues
  loading: boolean
  onChange: (values: GLFilterValues) => void
  onView: () => void
}

export default function GLViewerFilter({ companies, values, loading, onChange, onView }: Props) {
  const t = useT()

  const companyOptions = [
    { value: 'all', label: t('glViewer.allCompanies') },
    ...companies,
  ]

  const sourceOptions = [
    { value: 'all', label: t('glViewer.allSources') },
    ...DATA_SOURCES.map((s) => ({ value: s, label: s })),
  ]

  const dateRange: [Dayjs | null, Dayjs | null] = [
    values.fromDate ? dayjs(values.fromDate) : null,
    values.toDate ? dayjs(values.toDate) : null,
  ]

  return (
    <div className="flex-shrink-0 flex gap-4 items-center flex-wrap">
      {/* Date range */}
      <div className="flex items-center gap-2">
        <RangePicker
          size="small"
          value={dateRange}
          format="DD/MM/YYYY"
          placeholder={[t('glViewer.fromDate'), t('glViewer.toDate')]}
          onChange={(dates) =>
            onChange({
              ...values,
              fromDate: dates?.[0]?.format('YYYY-MM-DD') ?? null,
              toDate: dates?.[1]?.format('YYYY-MM-DD') ?? null,
            })
          }
        />
      </div>

      <div className="flex justify-end gap-3 items-center ml-auto">
        {/* Company */}
        <SelectDropdown
          title={t('glViewer.company')}
          value={values.comcode}
          menuItems={companyOptions.map((c) => ({ key: c.value, label: c.label }))}
          onChange={(v) => onChange({ ...values, comcode: v || 'all' })}
        />

        {/* DataSource */}
        <SelectDropdown
          title={t('glViewer.dataSource')}
          value={values.dataSource}
          menuItems={sourceOptions.map((s) => ({ key: s.value, label: s.label }))}
          onChange={(v) => onChange({ ...values, dataSource: v || 'all' })}
        />

        {/* Actions */}
        <Button
          type="primary"
          size="small"
          icon={<SearchOutlined />}
          onClick={onView}
          loading={loading}
        >
          {t('glViewer.view')}
        </Button>
      </div>
    </div>
  )
}
