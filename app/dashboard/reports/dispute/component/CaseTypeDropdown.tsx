'use client';

import CheckboxDropdown from '@/app/components/CheckboxDropdown';
import { useState } from 'react';
import { CASE_TYPE_OPTIONS } from '../data';

const CaseTypeDropdown = () => {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <CheckboxDropdown
      label="Case Type"
      options={CASE_TYPE_OPTIONS}
      selected={selected}
      onChange={(value) => setSelected(value.length ? value : [])}
    />
  );
};

export default CaseTypeDropdown;
