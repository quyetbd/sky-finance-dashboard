'use client';

import TableReport from '@/app/dashboard/reports/components/TableReport';
import { DATA, sumRows } from './data';
import disputeColumns from './component/DisputeColumns';
import { renderDisputeSummary } from './component/DisputeSummary';
import ComcodeFilterDropdown from '../components/ComcodeFilterDropdown';
import CaseTypeDropdown from './component/CaseTypeDropdown';
import CaseStatusDropdown from './component/CaseStatusDropdown';
import FinalOutcomeDropdown from './component/FinalOutcomeDropdown';
import type { DisputeRow } from './types';
import { Button } from 'antd';

export default function DisputePage() {
  const totals = sumRows(DATA);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-fontSizeHeading4 font-fontWeightStrong text-colorTextHeading">
          Dispute And Chargeback Report
        </h1>
        <Button>Export</Button>
      </div>
      <TableReport<DisputeRow>
        columns={disputeColumns}
        dataSource={DATA}
        summary={() => renderDisputeSummary(totals)}
        scrollX={1350}
        filterSlot={
          <>
            <ComcodeFilterDropdown />
            <CaseTypeDropdown />
            <CaseStatusDropdown />
            <FinalOutcomeDropdown />
          </>
        }
      />
    </div>
  );
}
