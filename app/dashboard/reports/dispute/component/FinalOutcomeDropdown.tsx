'use client';

import CheckboxDropdown from '@/app/components/CheckboxDropdown';
import { useState } from 'react';
import { FINAL_OUTCOME_OPTIONS } from '../data';
import { useT } from '@/lib/i18n/LocaleContext';

const FinalOutcomeDropdown = () => {
  const t = useT();
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <CheckboxDropdown
      label={t('disputeReport.filter.finalOutcome')}
      options={FINAL_OUTCOME_OPTIONS}
      selected={selected}
      onChange={(value) => setSelected(value.length ? value : [])}
    />
  );
};

export default FinalOutcomeDropdown;
