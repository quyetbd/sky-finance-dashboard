'use client';

import TableReport from '@/app/dashboard/reports/components/TableReport';
import { DATA, sumRows } from './data';
import byMarketColumns from './component/ByMarketColumns';
import { renderByMarketSummary } from './component/ByMarketSummary';
import MarketDropdown from './component/MarketDropdown';
import ComcodeFilterDropdown from '../components/ComcodeFilterDropdown';
import StatusFilterDropdown from '../components/StatusFilterDropdown';
import type { ByMarketRow } from './types';
import { Button } from 'antd';

export default function ByMarketPage() {
  const totals = sumRows(DATA);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-fontSizeHeading4 font-fontWeightStrong text-colorTextHeading">
          Profit Report
        </h1>
        <Button>Export</Button>
      </div>
      <TableReport<ByMarketRow>
        columns={byMarketColumns}
        dataSource={DATA}
        summary={() => renderByMarketSummary(totals)}
        scrollX={1350}
        expandable={{ defaultExpandAllRows: true }}
        filterSlot={
          <>
            <MarketDropdown />
            <ComcodeFilterDropdown />
            <StatusFilterDropdown />
          </>
        }
      />
    </div>
  );
}
