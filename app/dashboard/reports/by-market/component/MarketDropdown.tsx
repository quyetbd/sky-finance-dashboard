'use client';

import CheckboxDropdown from '@/app/components/CheckboxDropdown';
import { useState } from 'react';
import { MARKET_OPTIONS } from '../data';

const MarketDropdown = () => {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <CheckboxDropdown
      label="Market"
      options={MARKET_OPTIONS}
      selected={selected}
      onChange={(value) => setSelected(value.length ? value : [])}
    />
  );
};

export default MarketDropdown;
