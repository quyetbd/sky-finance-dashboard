'use client';

import CheckboxDropdown from '@/app/components/CheckboxDropdown';
import React, { useState } from 'react';
import { SELLER_OPTIONS } from '../profit/data';
import { useT } from '@/lib/i18n/LocaleContext';

const SellerFilterDropdown = () => {
  const t = useT();
  const [seller, setSeller] = useState<string[]>([]);

  return (
    <CheckboxDropdown
      label={t('table.seller')}
      options={SELLER_OPTIONS}
      selected={seller}
      onChange={(value) => setSeller(value.length ? value : [])}
    />
  );
};

export default SellerFilterDropdown;
