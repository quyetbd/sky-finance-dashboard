'use client';

import CheckboxDropdown from '@/app/components/CheckboxDropdown';
import { useState } from 'react';
import { MARKET_OPTIONS } from '../data';
import { useT } from '@/lib/i18n/LocaleContext';

const MarketDropdown = () => {
  const t = useT();
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <CheckboxDropdown
      label={t('byMarket.filter.market')}
      options={MARKET_OPTIONS}
      selected={selected}
      onChange={(value) => setSelected(value.length ? value : [])}
    />
  );
};

export default MarketDropdown;
