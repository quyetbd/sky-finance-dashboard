'use client';

import CheckboxDropdown from '@/app/components/CheckboxDropdown';
import { useState } from 'react';
import { CASE_TYPE_OPTIONS } from '../data';
import { useT } from '@/lib/i18n/LocaleContext';

const CaseTypeDropdown = () => {
  const t = useT();
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <CheckboxDropdown
      label={t('disputeReport.filter.caseType')}
      options={CASE_TYPE_OPTIONS}
      selected={selected}
      onChange={(value) => setSelected(value.length ? value : [])}
    />
  );
};

export default CaseTypeDropdown;
