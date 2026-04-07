'use client';

import TableReport from '@/app/dashboard/reports/components/TableReport';
import { DATA, sumRows } from './data';
import { useProfitColumns } from './component/ProfitColumns';
import type { ProfitRow } from './types';
import { renderProfitSummary } from './component/ProfitSummary';
import { Button } from 'antd';
import { useT } from '@/lib/i18n/LocaleContext';

export default function ProfitPage() {
  const t = useT();
  const profitColumns = useProfitColumns();
  const totals = sumRows(DATA);
  const pct = totals.gmv > 0 ? Math.round((totals.profit / totals.gmv) * 100) : 0;

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between'>
        <h1 className='text-fontSizeHeading4 font-fontWeightStrong text-colorTextHeading'>
          {t('profitReport.title')}
        </h1>
        <Button>{t('common.export')}</Button>
      </div>
      <TableReport<ProfitRow>
        columns={profitColumns}
        dataSource={DATA}
        summary={() => renderProfitSummary(totals, pct, t)}
      />
    </div>
  );
}
