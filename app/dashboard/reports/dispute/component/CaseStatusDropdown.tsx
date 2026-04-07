'use client';

import CheckboxDropdown from '@/app/components/CheckboxDropdown';
import { useState } from 'react';
import { CASE_STATUS_OPTIONS } from '../data';

const CaseStatusDropdown = () => {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <CheckboxDropdown
      label="Case Status"
      options={CASE_STATUS_OPTIONS}
      selected={selected}
      onChange={(value) => setSelected(value.length ? value : [])}
    />
  );
};

export default CaseStatusDropdown;
