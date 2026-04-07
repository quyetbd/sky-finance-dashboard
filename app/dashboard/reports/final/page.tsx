'use client';

import { Button } from 'antd';
import TableReport from '../components/TableReport';
import { ProfitRow } from '../profit/types';
import profitColumns from '../profit/component/ProfitColumns';
import { DATA, sumRows } from '../profit/data';
import { renderProfitSummary } from '../profit/component/ProfitSummary';

export default function FinalPage() {
  const totals = sumRows(DATA);
  const pct = totals.gmv > 0 ? Math.round((totals.profit / totals.gmv) * 100) : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-fontSizeHeading4 font-fontWeightStrong text-colorTextHeading">
          Finnal Report
        </h1>
        <Button>Export</Button>
      </div>
      <TableReport<ProfitRow>
        columns={profitColumns}
        dataSource={DATA}
        summary={() => renderProfitSummary(totals, pct)}
        isFinnalReport
      />
    </div>
  );
}
