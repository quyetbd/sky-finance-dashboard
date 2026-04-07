'use client';

import TableReport from '@/app/dashboard/reports/components/TableReport';
import { DATA, sumRows } from './data';
import { useByMarketColumns } from './component/ByMarketColumns';
import { renderByMarketSummary } from './component/ByMarketSummary';
import MarketDropdown from './component/MarketDropdown';
import ComcodeFilterDropdown from '../components/ComcodeFilterDropdown';
import StatusFilterDropdown from '../components/StatusFilterDropdown';
import type { ByMarketRow } from './types';
import { Button } from 'antd';
import { useT } from '@/lib/i18n/LocaleContext';

export default function ByMarketPage() {
  const t = useT();
  const byMarketColumns = useByMarketColumns();
  const totals = sumRows(DATA);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-fontSizeHeading4 font-fontWeightStrong text-colorTextHeading">
          {t('byMarket.title')}
        </h1>
        <Button>{t('common.export')}</Button>
      </div>
      <TableReport<ByMarketRow>
        columns={byMarketColumns}
        dataSource={DATA}
        summary={() => renderByMarketSummary(totals, t)}
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
