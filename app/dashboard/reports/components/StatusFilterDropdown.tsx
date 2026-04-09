'use client';

import CheckboxDropdown from '@/app/components/CheckboxDropdown';
import React, { useState } from 'react';
import { STATUS_OPTIONS } from '../profit/data';
import { useT } from '@/lib/i18n/LocaleContext';

const StatusFilterDropdown = () => {
  const t = useT();
  const [status, setStatus] = useState<string[]>([]);

  return (
    <CheckboxDropdown
      label={t('table.status')}
      options={STATUS_OPTIONS}
      selected={status}
      onChange={(value) => setStatus(value.length ? value : [])}
    />
  );
};

export default StatusFilterDropdown;
