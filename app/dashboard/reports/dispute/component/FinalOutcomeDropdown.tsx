'use client';

import CheckboxDropdown from '@/app/components/CheckboxDropdown';
import { useState } from 'react';
import { FINAL_OUTCOME_OPTIONS } from '../data';

const FinalOutcomeDropdown = () => {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <CheckboxDropdown
      label="Final Case Outcome"
      options={FINAL_OUTCOME_OPTIONS}
      selected={selected}
      onChange={(value) => setSelected(value.length ? value : [])}
    />
  );
};

export default FinalOutcomeDropdown;
