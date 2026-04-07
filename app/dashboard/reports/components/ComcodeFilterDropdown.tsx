'use client';

import CheckboxDropdown from '@/app/components/CheckboxDropdown';
import React, { useState } from 'react';
import { COMCODE_OPTIONS } from '../profit/data';
import { useT } from '@/lib/i18n/LocaleContext';

const ComcodeFilterDropdown = () => {
  const t = useT();
  const [comcode, setComcode] = useState<string[]>([]);

  return (
    <CheckboxDropdown
      label={t('table.comcode')}
      options={COMCODE_OPTIONS}
      selected={comcode}
      onChange={(value) => setComcode(value.length ? value : [])}
    />
  );
};

export default ComcodeFilterDropdown;
