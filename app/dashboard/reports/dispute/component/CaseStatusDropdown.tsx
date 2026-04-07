'use client';

import CheckboxDropdown from '@/app/components/CheckboxDropdown';
import { useState } from 'react';
import { CASE_STATUS_OPTIONS } from '../data';
import { useT } from '@/lib/i18n/LocaleContext';

const CaseStatusDropdown = () => {
  const t = useT();
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <CheckboxDropdown
      label={t('disputeReport.filter.caseStatus')}
      options={CASE_STATUS_OPTIONS}
      selected={selected}
      onChange={(value) => setSelected(value.length ? value : [])}
    />
  );
};

export default CaseStatusDropdown;
