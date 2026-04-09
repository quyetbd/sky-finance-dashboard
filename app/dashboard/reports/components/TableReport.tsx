'use client';

import { useRef } from 'react';
import { DatePicker, DatePickerProps, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';
import SellerFilterDropdown from './SellerFilterDropdown';
import StatusFilterDropdown from './StatusFilterDropdown';
import SelectDropdown from '@/app/components/SelectDropdown';
import DateRangeFilter from './DateRangeFilter';
import ComcodeFilterDropdown from './ComcodeFilterDropdown';
import { useT } from '@/lib/i18n/LocaleContext';

export type FilterConfig = {
  key: string;
  label: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  width?: number;
};

export type TableReportProps<T extends object> = {
  columns: ColumnsType<T>;
  dataSource: T[];
  filters?: FilterConfig[];
  dateFieldOptions?: { label: string; key: string }[];
  onDateFieldChange?: (value: string) => void;
  onChangePeriod?: DatePickerProps['onChange'];
  onDateRangeChange?: (start: dayjs.Dayjs | null, end: dayjs.Dayjs | null) => void;
  loading?: boolean;
  summary?: (pageData: readonly T[]) => React.ReactNode;
  scrollX?: number;
  rowKey?: string;
  isFinnalReport?: boolean;
  filterSlot?: React.ReactNode;
  expandable?: TableProps<T>['expandable'];
  pagination?: TableProps<T>['pagination'];
  hideFilterBar?: boolean;
  rowSelection?: TableProps<T>['rowSelection'];
};

export default function TableReport<T extends object>({
  columns,
  dataSource,
  dateFieldOptions,
  onChangePeriod,
  onDateRangeChange,
  loading = false,
  summary,
  scrollX = 1200,
  rowKey = 'key',
  filterSlot,
  isFinnalReport = false,
  expandable,
  pagination,
  hideFilterBar = false,
  rowSelection,
}: TableReportProps<T>) {
  const t = useT();
  const tableWrapRef = useRef<HTMLDivElement>(null);

  const defaultDateFieldOptions = [
    { label: t('table.paidDate'), key: 'PaidDate' },
    { label: t('table.fulfilledDate'), key: 'FulfilledDate' },
  ];

  return (
    <div className={`flex-1 flex flex-col gap-3 ${hideFilterBar ? 'p-0' : 'p-4'} overflow-y-hidden bg-white rounded-lg`}>
      {!hideFilterBar && (
        <div className="flex-shrink-0 flex gap-4 items-center justify-between">
          {isFinnalReport ? (
            <DatePicker onChange={onChangePeriod} picker="month" />
          ) : (
            <DateRangeFilter onChange={onDateRangeChange} />
          )}
          <div className="flex justify-end gap-4">
            <SelectDropdown
              title={t('table.dateField')}
              menuItems={dateFieldOptions ?? defaultDateFieldOptions}
            />
            {filterSlot ?? (
              <>
                <ComcodeFilterDropdown />
                <SellerFilterDropdown />
                <StatusFilterDropdown />
              </>
            )}
          </div>
        </div>
      )}

      <div className='table-report flex-1 overflow-hidden' ref={tableWrapRef}>
        <Table<T>
          className="report-table"
          rowKey={rowKey}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={pagination ?? false}
          size="small"
          scroll={{ x: scrollX, y: 'calc(100vh - 316px)' }}
          bordered
          expandable={expandable}
          summary={summary}
          rowSelection={rowSelection}
        />
      </div>
    </div>
  );
}
